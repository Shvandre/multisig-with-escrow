import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from "@ton/core";

export type PluginConfig = {
    approver: Address,
    returnAddress: Address | null,
    deadline: bigint,
    transferDestination: Address,
};

export function escrowConfigToCell(config: PluginConfig): Cell {
    return beginCell()
        .storeAddress(config.approver)
        .storeAddress(config.returnAddress)
        .storeUint(config.deadline, 32)
        .storeAddress(config.transferDestination)
    .endCell();
}

export class Escrow implements Contract {

    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static code = Cell.fromHex("b5ee9c7241010a0100db000114ff00f4a413f4bcf2c80b01020162020300c6d0f891f240ed44d0f82301fa40fa40d31ffa403004b98e186c2220d72c013159e304c8cf8508ce70cf0b6ec98306fb00e03002d72c24ad5b618c8e1730f89258c705f2e066c8cf8508ce70cf0b6ec98306fb00e06c21d72c251c17ca8431dc840ff2f002012004050023bcf86f6a2687d207d2018e98f98fd2018e8c02012006070031bbf2ced44d0fa40fa40d31f31fa4031d120d72c013159e30480201c708090022aaf6ed44d0fa4031fa4031d31f31fa40d10022a936ed44d0fa4031fa4031d31ffa4031d168b81d9b");

    static createFromAddress(address: Address) {
        return new Escrow(address);
    }

    static createFromConfig(config: PluginConfig, workchain = 0) {
        const data = escrowConfigToCell(config);
        const init = { code: this.code, data };
        return new Escrow(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async sendApproveTransfer(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().storeUint(0x95ab6c31, 32).endCell(),
        });
    }

    async sendTopUp(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().storeUint(0xa382f950, 32).endCell(),
        });
    }

    async getApprover(provider: ContractProvider) {
        const result = await provider.get('approver', []);
        return result.stack.readAddress();
    }

    async getReturnAddress(provider: ContractProvider) {
        const result = await provider.get('returnAddress', []);
        return result.stack.readAddress();
    }

    async getDeadline(provider: ContractProvider) {
        const result = await provider.get('deadline', []);
        return result.stack.readBigNumber();
    }

    async getTransferDestination(provider: ContractProvider) {
        const result = await provider.get('transferDestination', []);
        return result.stack.readAddress();
    }
}
