// METAMASK CONNECTION
const TIMEOUT = 1000;
const COLLECTION_NAME = 'DefaultTokens';
let editions = [];
let dots = 1;

window.addEventListener('DOMContentLoaded', () => {
	const onboarding = new MetaMaskOnboarding();
	const onboardButton = document.getElementById('connectWallet');
	const walletActions = document.getElementById('walletActions');
	const checkWallet = document.getElementById('checkWallet');
	
	let accounts;

	// MetaMask + Reader
  const updateWalletButton = async () => {
    if (!MetaMaskOnboarding.isMetaMaskInstalled()) {
      onboardButton.innerText = 'Install MetaMask';
	  walletActions.innterText = 'Install MetaMask';
	   walletActions.innterText = 'Install MetaMask';
      onboardButton.onclick = () => {
        onboardButton.innerText = 'Connecting...';
        onboardButton.disabled = true;
        onboarding.startOnboarding();
      };
	  
    } else if (accounts && accounts.length > 0) {
      onboardButton.innerText = `Connected Wallet ...${accounts[0].slice(-4)} ✔`;
      onboardButton.disabled = true;
      onboarding.stopOnboarding();
      //checkOwner(accounts[0]);
	  
	  walletActions.style.display = 'none';
	  checkWallet.style.display = 'block';
	  
    } else {
      onboardButton.innerText = 'Connect MetaMask';
	  walletActions.innterText = 'Connect MetaMask';
	  
      onboardButton.onclick = async () => {
        await window.ethereum.request({
          method: 'eth_requestAccounts',
        })
        .then(function(accounts) {
          onboardButton.innerText = `Connected Wallet ...${accounts[0].slice(-4)} ✔`;
          onboardButton.disabled = true;
          //checkOwner(accounts[0]);
		  
		  walletActions.style.display = 'none';
		  checkWallet.style.display = 'block';
        });
      };
    }
  };

  updateWalletButton();
  if (MetaMaskOnboarding.isMetaMaskInstalled()) {
    window.ethereum.on('accountsChanged', (newAccounts) => {
      accounts = newAccounts;
      updateWalletButton();
    });
  }
  
	checkWallet.onclick = async () => {
		console.log('CheckOwner Trigger');
		checkOwner(accounts[0]);
	}
});

const checkOwner = async (account) => {
  if(account) {
    let isOwner = false;
    let page = 1
    
    const data = await fetchWithRetry(`/.netlify/functions/isowner/?wallet=${account}&page=${page}`);

	console.log(data);

    isOwner = !isOwner ? data.isOwner : isOwner;
    updateStatusText(isOwner, true)
    
    editions = [...data.editions]
    let nextPage = data.next_page

    while(nextPage) {
      page = nextPage
      const data = await fetchWithRetry(`/.netlify/functions/isowner/?wallet=${account}&page=${page}`);

      isOwner = !isOwner ? data.isOwner : isOwner;
      updateStatusText(isOwner, true)
      
      editions = [...editions, ...data.editions]
      nextPage = data.next_page
    }

    updateStatusText(isOwner, false)
  }
}

const uploadImagesToIPFS = async => {
	let imagePath = "/images/tokens/default-tokens.png";
	
    const data = await fetchWithRetry(`/.netlify/functions/uploadImagesToIPFS/?imagePath=${imagePath}`);

	console.log(data);
}

function updateStatusText(isOwner, checking) {
  const statusText = document.querySelector('.owner-status');
  if(checking) {
    if(isOwner) {
      statusText.innerText = `You do own ${COLLECTION_NAME}!!  Let's see how many${renderDots(dots)}`;
    } else {
      statusText.innerText = `Checking to see if you own any ${COLLECTION_NAME} ${renderDots(dots)}`;
    }
  } else {
    if(isOwner) {
      statusText.innerText = `You own ${editions.length} ${COLLECTION_NAME}!! `;
    } else {
      statusText.innerText = `You don't own any ${COLLECTION_NAME} `;
    }
  }
  dots = dots === 3 ? 1 : dots + 1;
}


// Helpers
function renderDots(dots) {
  let dotsString = '';
  for (let i = 0; i < dots; i++) {
    dotsString += '.';
  }
  return dotsString;
}

function timer(ms) {
  return new Promise(res => setTimeout(res, ms));
}

async function fetchWithRetry(url)  {
  await timer(TIMEOUT);
  return new Promise((resolve, reject) => {
    const fetch_retry = (_url) => {
      return fetch(_url).then(async (res) => {
        const status = res.status;

        if(status === 200) {
          return resolve(res.json());
        }            
        else {
          console.error(`ERROR STATUS: ${status}`)
          console.log('Retrying')
          await timer(TIMEOUT)
          fetch_retry(_url)
        }            
      })
      .catch(async (error) => {  
        console.error(`CATCH ERROR: ${error}`)  
        console.log('Retrying')    
        await timer(TIMEOUT)    
        fetch_retry(_url)
      }); 
    }
    return fetch_retry(url);
  });
}