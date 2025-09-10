import {
    Address,
    Cell,
    Contract,
    ContractGetMethodResult,
    ContractProvider,
    ContractState,
    OpenedContract,
    Sender,
    SendMode,
    Transaction,
    TupleItem
} from "@ton/core";
import {TonClient} from "@ton/ton";

const API_KEY = '0a5ed4bac006e02ff45b9978049612c0b73d3e60962ae8dfffd106d0ff90bbeb';

export const sendToIndex = async (method: string, params: any, isTestnet: boolean) => {
    const mainnetRpc = 'https://toncenter.com/api/v3/';
    const testnetRpc = 'https://testnet.toncenter.com/api/v3/';
    const rpc = isTestnet ? testnetRpc : mainnetRpc;

    const headers = {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY
    };

    const response = await fetch(rpc + method + '?' + new URLSearchParams(params), {
        method: 'GET',
        headers: headers,
    });
    const json = await response.json();
    if (json.error) {
        throw new Error(json.error);
    }
    return json;
}

export const sendToTonApi = async (method: string, params: any, isTestnet: boolean) => {
    const mainnetRpc = 'https://tonapi.io/v2/';
    const testnetRpc = 'https://testnet.tonapi.io/v2/';
    const rpc = isTestnet ? testnetRpc : mainnetRpc;

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer AFPJTKEBPOX3AIYAAAAKA2HWOTRNJP5MUCV5DMDCZAAOCPSAYEYS3CILNQVLF2HWKED6USY'
    };

    const response = await fetch(rpc + method + '?' + new URLSearchParams(params), {
        method: 'GET',
        headers: headers,
    });
    const json = await response.json();
    if (json.error) {
        throw new Error(json.error);
    }
    return json;
}

export class MyNetworkProvider implements ContractProvider {
    private contractAddress: Address;
    private isTestnet: boolean;
    private tonClient: TonClient;

    constructor(contractAddress: Address, isTestnet: boolean) {
        this.contractAddress = contractAddress;
        this.isTestnet = isTestnet;
        this.tonClient = new TonClient({
            endpoint: isTestnet ? 'https://testnet.toncenter.com/api/v2/jsonRPC' : 'https://toncenter.com/api/v2/jsonRPC',
            apiKey: API_KEY
        });
    }

    getState(): Promise<ContractState> {
        throw new Error("Method not implemented.");
    }

    get(name: string, args: TupleItem[]): Promise<ContractGetMethodResult> {
        return this.tonClient.runMethod(this.contractAddress, name, args);
    }

    external(message: Cell): Promise<void> {
        throw new Error("Method not implemented.");
    }

    internal(via: Sender, args: {
        value: string | bigint;
        bounce?: boolean;
        sendMode?: SendMode;
        body?: string | Cell;
    }): Promise<void> {
        throw new Error("Method not implemented.");
    }

    open<T extends Contract>(contract: T): OpenedContract<T> {
        throw new Error("Method not implemented.");
    }

    getTransactions(address: Address, lt: bigint, hash: Buffer, limit?: number): Promise<Transaction[]> {
        throw new Error("Method not implemented.");
    }

}