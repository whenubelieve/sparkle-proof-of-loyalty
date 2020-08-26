const SparkleLoyalty = artifacts.require('./SparkleLoyalty');
const SparkleTimestamp = artifacts.require('./SparkleTimestamp');
const SparkleRewardTiers = artifacts.require('./SparkleRewardTiers');

const onchainSparkleTokenAddress = '0x14d8d4e089a4ae60f315be178434c651d11f9b9a';

module.exports = async function(deployer, network, accounts) {
	return deployer
	.then(() => {
		return deployer.deploy(SparkleRewardTiers, {overwrite: false});
	})
	.then(() => {
		return deployer.deploy(SparkleTimestamp, {overwrite: false});
	}).then(() => {
		const tokenAddress = onchainSparkleTokenAddress;
		const treasuryAddress = accounts[1];
		const collectionAddress = accounts[4];
		const timestampAddress = SparkleTimestamp.address;
		const tiersAddress = SparkleRewardTiers.address;

		return deployer.deploy(SparkleLoyalty, tokenAddress, treasuryAddress, collectionAddress, tiersAddress, timestampAddress);
	}).then(() => {
		SparkleRewardTiers.deployed({overwrite: false })
		.then(function (rti) {
			// rti.setContractAddress(SparkleLoyalty.address, {from: accounts[0]});
			SparkleTimestamp.deployed({ overwrite: false })
			.then(function (tsi) {
				tsi.setContractAddress(SparkleLoyalty.address, {from: accounts[0]});
				tsi.setTimePeriod(60*3, {from: accounts[0]});
			});
		});
	});
};