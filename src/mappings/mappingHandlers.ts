import { createType, createTypeUnsafe, TypeRegistry } from "@polkadot/types";
import { EventRecord } from "@polkadot/types/interfaces";
import { SubstrateExtrinsic, SubstrateBlock } from "@subql/types";
import { SpecVersion, Event, Extrinsic } from "../types";

interface method {
  args: {
    dest: {
      Id: string;
    };
    value: string;
  };
  method: string;
  section: string;
}

let specVersion: SpecVersion;
export async function handleBlock(block: SubstrateBlock): Promise<void> {
  // Initialise Spec Version
  if (!specVersion) {
    specVersion = await SpecVersion.get(block.specVersion.toString());
  }

  // Check for updates to Spec Version
  if (!specVersion || specVersion.id !== block.specVersion.toString()) {
    specVersion = new SpecVersion(block.specVersion.toString());
    specVersion.blockHeight = block.block.header.number.toBigInt();
    await specVersion.save();
  }

  // Process all events in block
  const events = block.events
    .filter(
      (evt) =>
        !(
          evt.event.section === "system" &&
          evt.event.method === "ExtrinsicSuccess"
        )
    )
    .map((evt, idx) =>
      handleEvent(block.block.header.number.toString(), idx, evt)
    );

  // Process all calls in block
  const calls = wrapExtrinsics(block).map((ext, idx) =>
    handleCall(`${block.block.header.number.toString()}-${idx}`, ext)
  );

  // Save all data
  await Promise.all([
    store.bulkCreate("Event", events),
    store.bulkCreate("Extrinsic", calls),
  ]);
}

function handleEvent(
  blockNumber: string,
  eventIdx: number,
  event: EventRecord
): Event {
  const newEvent = new Event(`${blockNumber}-${eventIdx}`);
  newEvent.blockHeight = BigInt(blockNumber);
  newEvent.module = event.event.section;
  newEvent.event = event.event.method;
  return newEvent;
}

function handleCall(idx: string, extrinsic: SubstrateExtrinsic): Extrinsic {
  const newExtrinsic = new Extrinsic(idx);
  newExtrinsic.txHash = extrinsic.extrinsic.hash.toString();
  newExtrinsic.module = extrinsic.extrinsic.method.section;
  newExtrinsic.call = extrinsic.extrinsic.method.method;
  if (newExtrinsic.module == "balances" && newExtrinsic.call == "transfer") {
	let obj: method = JSON.parse(JSON.stringify(extrinsic.extrinsic.method.toHuman()));
	newExtrinsic.value =obj.args.value;
	newExtrinsic.destId = obj.args.dest.Id;
  }
  newExtrinsic.blockHeight = extrinsic.block.block.header.number.toBigInt();
  newExtrinsic.success = extrinsic.success;
  newExtrinsic.isSigned = extrinsic.extrinsic.isSigned;
  return newExtrinsic;
}

function wrapExtrinsics(wrappedBlock: SubstrateBlock): SubstrateExtrinsic[] {
  return wrappedBlock.block.extrinsics.map((extrinsic, idx) => {
    const events = wrappedBlock.events.filter(
      ({ phase }) => phase.isApplyExtrinsic && phase.asApplyExtrinsic.eqn(idx)
    );
    return {
      idx,
      extrinsic,
      block: wrappedBlock,
      events,
      success:
        events.findIndex((evt) => evt.event.method === "ExtrinsicSuccess") > -1,
    };
  });
}
