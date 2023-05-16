import React from "react";
import Button from "../../../../../components/Button";
import { useSelector, useDispatch } from "react-redux";
import { LOGIN_INFO } from "../../../../../constants/localStorage";
import { submitFormData } from "../../../../../store/actions/transactions/delegationTransfer";
import { stringToNumber } from "../../../../../utils/scripts";
import { tokenValueConversion } from "../../../../../utils/helper";
import {
  DelegationTransferMsg,
  WithdrawMsg
} from "../../../../../utils/protoMsgHelper";

const Submit = () => {
  const dispatch = useDispatch();
  const loginInfo = JSON.parse(localStorage.getItem(LOGIN_INFO));
  const toAddress = useSelector((state) => state.delegationTransfer.toAddress);
  const list = useSelector((state) => state.delegationTransfer.list);
  const memo = useSelector((state) => state.delegationTransfer.memo);

  const onClick = () => {
    let messages = [];
    list.forEach(async (item) => {
      messages.push(
        DelegationTransferMsg(
          loginInfo.address,
          item.address,
          toAddress.value,
          (item.inputAmount * 1000000).toFixed(0)
        )
      );
    });
    dispatch(submitFormData(messages));
  };

  const disable =
    toAddress.value === "" ||
    toAddress.error.message !== "" ||
    memo.error.message !== "";

  const onClickKeplr = () => {
    let messages = [];
    list.forEach(async (item) => {
      messages.push(
        DelegationTransferMsg(
          loginInfo.address,
          item.address,
          toAddress,
          (item.inputAmount * 1000000).toFixed(0)
        )
      );
    });
    dispatch(
      setTxName({
        value: {
          name: "delegation-transfer"
        }
      })
    );
    dispatch(keplrSubmit(messages));
  };

  return (
    <div className="buttons">
      <div className="button-section">
        <Button
          className="button button-primary"
          type="button"
          disable={disable}
          value="Transfer"
          onClick={
            loginInfo && loginInfo.loginMode === "keplr"
              ? onClickKeplr
              : onClick
          }
        />
      </div>
    </div>
  );
};

export default Submit;
