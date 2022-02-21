async function main() {
    const MonalizaFactory = await ethers.getContractFactory("MonalizaFactory")
  
    // Start deployment, returning a promise that resolves to a contract object
    const monalizaFactory = await MonalizaFactory.deploy("0x4d4581c01A457925410cd3877d17b2fd4553b2C5")
    console.log("Contract deployment tx hash:", monalizaFactory.deployTransaction.hash)
    console.log("Contract deployed to address:", monalizaFactory.address)
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
  