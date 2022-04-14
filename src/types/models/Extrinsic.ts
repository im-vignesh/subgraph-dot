// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames} from "@subql/types";
import assert from 'assert';




type ExtrinsicProps = Omit<Extrinsic, NonNullable<FunctionPropertyNames<Extrinsic>>>;

export class Extrinsic implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public txHash: string;

    public module: string;

    public call: string;

    public blockHeight: bigint;

    public success: boolean;

    public isSigned: boolean;

    public value?: string;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save Extrinsic entity without an ID");
        await store.set('Extrinsic', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove Extrinsic entity without an ID");
        await store.remove('Extrinsic', id.toString());
    }

    static async get(id:string): Promise<Extrinsic | undefined>{
        assert((id !== null && id !== undefined), "Cannot get Extrinsic entity without an ID");
        const record = await store.get('Extrinsic', id.toString());
        if (record){
            return Extrinsic.create(record as ExtrinsicProps);
        }else{
            return;
        }
    }


    static async getByTxHash(txHash: string): Promise<Extrinsic[] | undefined>{
      
      const records = await store.getByField('Extrinsic', 'txHash', txHash);
      return records.map(record => Extrinsic.create(record as ExtrinsicProps));
      
    }

    static async getByModule(module: string): Promise<Extrinsic[] | undefined>{
      
      const records = await store.getByField('Extrinsic', 'module', module);
      return records.map(record => Extrinsic.create(record as ExtrinsicProps));
      
    }

    static async getByCall(call: string): Promise<Extrinsic[] | undefined>{
      
      const records = await store.getByField('Extrinsic', 'call', call);
      return records.map(record => Extrinsic.create(record as ExtrinsicProps));
      
    }

    static async getByBlockHeight(blockHeight: bigint): Promise<Extrinsic[] | undefined>{
      
      const records = await store.getByField('Extrinsic', 'blockHeight', blockHeight);
      return records.map(record => Extrinsic.create(record as ExtrinsicProps));
      
    }


    static create(record: ExtrinsicProps): Extrinsic {
        assert(typeof record.id === 'string', "id must be provided");
        let entity = new Extrinsic(record.id);
        Object.assign(entity,record);
        return entity;
    }
}
