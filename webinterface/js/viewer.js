let currentAccount = null;
let web3;
let abi;

let contractAddress = "";
$.getJSON(
  "http://127.0.0.1:5500/webinterface/contract.json",
  function (result) {
    contractAddress = result.OriginalOtakuCoin;
    console.log(contractAddress);
    $("#contractAddress").text(contractAddress);
  }
);

function handleAccountsChanged(accounts) {
  console.log("Calling HandleChanged");

  if (accounts.length === 0) {
    console.log("Please connect to MetaMask.");
    $("#enableMetamask").html("Connect with Metamask");
  } else if (accounts[0] !== currentAccount) {
    currentAccount = accounts[0];
    $("#enableMetamask").html(currentAccount);
    $("#status").html("");

    if (currentAccount != null) {
      // Set the button label
      $("#enableMetamask").html(currentAccount);
    }
  }
  console.log("WalletAddress in HandleAccountChanged =" + currentAccount);
}

function connect() {
  console.log("Calling connect()");
  ethereum
    .request({ method: "eth_requestAccounts" })
    .then(handleAccountsChanged)
    .catch((err) => {
      if (err.code === 4001) {
        // EIP-1193 userRejectedRequest error
        // If this happens, the user rejected the connection request.
        console.log("Please connect to MetaMask.");
        $("#status").html("You refused to connect Metamask");
      } else {
        console.error(err);
      }
    });
}

function detectMetaMask() {
  if (typeof window.ethereum !== "undefined") {
    return true;
  } else {
    return false;
  }
}

async function getSymbol() {
  const contractFirst = new web3.eth.Contract(abi, contractAddress);
  contractFirst.methods
    .symbol()
    .call()
    .then(function (result) {
      console.log(result);
      $("#symbol").text(result);
    });
}

async function getName() {
  const contractFirst = new web3.eth.Contract(abi, contractAddress);
  contractFirst.methods
    .name()
    .call()
    .then(function (result) {
      console.log(result);
      $("#collectionName").text(result);
    });
}

async function getValue() {
  console.log("GetValue");
  input_value = $("#value").val();
  const contractFirst = new web3.eth.Contract(abi, contractAddress);
  console.log("getValue" + currentAccount);
  contractFirst.methods
    .tokenURI(parseInt(input_value))
    .call()
    .then(function (result) {
      let d = result.split("base64,")[1];
      d = atob(d);
      console.log(d);
      d = JSON.parse(d);
      console.log(d);
      $("#name").text(d.name);
      $("#description").html(d.description.replaceAll("\n", "<br/>"));
      console.log(d.description);
      $("#nft").prop("src", d.image);
    });
}

$.getJSON(
  "http://127.0.0.1:5500/artifacts/contracts/OriginalOtakuCoin.sol/OriginalOtakuCoin.json",
  function (result) {
    abi = result.abi;
  }
);

$(document).ready(async function () {
  m = detectMetaMask();
  if (m) {
    $("#metaicon").removeClass("meta-gray");
    $("#metaicon").addClass("meta-normal");
    $("#enableMetamask").attr("disabled", false);
    connect(); // Make sure the connected wallet is being returned
  } else {
    $("#enableMetamask").attr("disabled", true);
    $("#metaicon").removeClass("meta-normal");
    $("#metaicon").addClass("meta-gray");
  }

  $("#enableMetamask").click(function () {
    connect();
  });

  $("#setValue").click(function () {
    getValue();
    getSymbol();
    getName();
  });

  try {
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  } catch (error) {
    alert(error);
  }

  getValue();
  getSymbol();
  getName();
});
