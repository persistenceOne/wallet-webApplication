import {MsgSend} from "@cosmjs/stargate/build/codec/cosmos/bank/v1beta1/tx";
import {MsgBeginRedelegate, MsgDelegate, MsgUndelegate} from "@cosmjs/stargate/build/codec/cosmos/staking/v1beta1/tx";
import {
    MsgSetWithdrawAddress,
    MsgWithdrawDelegatorReward,
    MsgWithdrawValidatorCommission
} from "@cosmjs/stargate/build/codec/cosmos/distribution/v1beta1/tx";
import {MsgTransfer} from "@cosmjs/stargate/build/codec/ibc/applications/transfer/v1/tx";
import {coin} from "@cosmjs/stargate";

const msgSendTypeUrl = "/cosmos.bank.v1beta1.MsgSend";
const msgDelegateTypeUrl = "/cosmos.staking.v1beta1.MsgDelegate";
const msgRedelegateTypeUrl = "/cosmos.staking.v1beta1.MsgBeginRedelegate";
const msgUnbondTypeUrl = "/cosmos.staking.v1beta1.MsgUndelegate";
const msgWithdrawRewardsTypeUrl = "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward";
const msgSetWithdrawAddressTypeUrl = "/cosmos.distribution.v1beta1.MsgSetWithdrawAddress";
const msgTransferTypeUrl = "/ibc.applications.transfer.v1.MsgTransfer";
const msgValidatorCommission = '/cosmos.distribution.v1beta1.MsgWithdrawValidatorCommission';

function SendMsg(fromAddress, toAddress, amount, denom) {
    return {
        typeUrl: msgSendTypeUrl,
        value: MsgSend.fromPartial({
            fromAddress: fromAddress,
            toAddress: toAddress,
            amount: [{
                denom: denom,
                amount: String(amount),
            }],
        }),
    };
}


function DelegateMsg(delegatorAddress, validatorAddress, amount) {
    return {
        typeUrl: msgDelegateTypeUrl,
        value: MsgDelegate.fromPartial({
            delegatorAddress: delegatorAddress,
            validatorAddress: validatorAddress,
            amount: {
                denom: "uxprt",
                amount: String(amount),
            },
        }
        ),
    };
}

function RedelegateMsg(delegatorAddress, validatorSrcAddress, validatorDstAddress, amount) {
    return {
        typeUrl: msgRedelegateTypeUrl,
        value: MsgBeginRedelegate.fromPartial({
            delegatorAddress: delegatorAddress,
            validatorSrcAddress: validatorSrcAddress,
            validatorDstAddress: validatorDstAddress,
            amount: {
                denom: "uxprt",
                amount: String(amount),
            },
        }
        ),
    };
}

function UnbondMsg(delegatorAddress, validatorAddress, amount) {
    return {
        typeUrl: msgUnbondTypeUrl,
        value: MsgUndelegate.fromPartial({
            delegatorAddress: delegatorAddress,
            validatorAddress: validatorAddress,
            amount: {
                denom: "uxprt",
                amount: String(amount),
            },
        }
        ),
    };

}

function WithdrawMsg(delegatorAddress, validatorAddress) {
    return {
        typeUrl: msgWithdrawRewardsTypeUrl,
        value: MsgWithdrawDelegatorReward.fromPartial({
            delegatorAddress: delegatorAddress,
            validatorAddress: validatorAddress,
        }),
    };
}

function SetWithDrawAddressMsg(delegatorAddress, withdrawAddress) {
    return {
        typeUrl: msgSetWithdrawAddressTypeUrl,
        value: MsgSetWithdrawAddress.fromPartial({
            delegatorAddress: delegatorAddress,
            withdrawAddress: withdrawAddress,
        }),
    };
}

function TransferMsg(channel, fromAddress, toAddress, amount, timeoutHeight, timeoutTimestamp, denom , port = "transfer") {
    return {
        typeUrl: msgTransferTypeUrl,
        value: MsgTransfer.fromPartial({
            sourcePort: port,
            sourceChannel: channel,
            token: coin(amount,denom),
            sender: fromAddress,
            receiver: toAddress,
            timeoutHeight: {
                revisionNumber: timeoutHeight.revisionNumber,
                revisionHeight: timeoutHeight.revisionHeight,
            },
            timeoutTimestamp: timeoutTimestamp,
        }),
    };
}

function ValidatorCommissionMsg(address){
    return {
        typeUrl: msgValidatorCommission,
        value: MsgWithdrawValidatorCommission.fromPartial({
            validatorAddress: address,
        }),
    };
}

export {SendMsg, DelegateMsg, RedelegateMsg, UnbondMsg, WithdrawMsg, SetWithDrawAddressMsg, TransferMsg, ValidatorCommissionMsg};
