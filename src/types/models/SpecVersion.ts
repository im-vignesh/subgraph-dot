// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames} from "@subql/types";
import assert from 'assert';




type SpecVersionProps = Omit<SpecVersion, NonNullable<FunctionPropertyNames<SpecVersion>>>;

export class SpecVersion implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public blockHeight: bigint;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save SpecVersion entity without an ID");
        await store.set('SpecVersion', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove SpecVersion entity without an ID");
        await store.remove('SpecVersion', id.toString());
    }

    static async get(id:string): Promise<SpecVersion | undefined>{
        assert((id !== null && id !== undefined), "Cannot get SpecVersion entity without an ID");
        const record = await store.get('SpecVersion', id.toString());
        if (record){
            return SpecVersion.create(record as SpecVersionProps);
        }else{
            return;
        }
    }



    static create(record: SpecVersionProps): SpecVersion {
        assert(typeof record.id === 'string', "id must be provided");
        let entity = new SpecVersion(record.id);
        Object.assign(entity,record);
        return entity;
    }
}
