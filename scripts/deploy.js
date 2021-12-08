async function main() {
    const MonalizaFactory = await ethers.getContractFactory("MonalizaFactory")
  
    // Start deployment, returning a promise that resolves to a contract object
    const monalizaFactory = await MonalizaFactory.deploy()
    console.log("Contract deployed to address:", monalizaFactory.address)
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
  