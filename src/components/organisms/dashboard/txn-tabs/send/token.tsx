import React, { useEffect, useState } from "react";
import Dropdown from "../../../../molecules/dropdown";
import { useAppStore } from "../../../../../../store/store";
import { BalanceList } from "../../../../../helpers/types";
import { stringTruncate } from "../../../../../helpers/utils";
import { getDecimalize } from "../../../../../helpers/coin";
import { CoinPretty } from "@keplr-wallet/unit";
import { Spinner } from "../../../../atoms/spinner";

const Token = () => {
  const [show, setShow] = useState<boolean>(false);

  const [balances, token] = useAppStore((state) => [
    state.wallet.balances,
    state.transactions.send.token,
  ]);

  const handleSendTxnToken = useAppStore((state) => state.handleSendTxnToken);

  const dropCloseDownHandler = (value: boolean) => {
    setShow(value);
  };

  const dropDownHandler = (item: any) => {
    handleSendTxnToken(item);
    setShow(false);
  };

  return (
    <div className="mb-4">
      <p className="mb-1 text-light-white-500">Token</p>
      <Dropdown
        className="text-light-high w-full"
        dropDownVariant="custom"
        closeDropdown={show}
        closeHandler={(value) => dropCloseDownHandler(value)}
        dropdownLabel={
          token ? (
            <div className="flex items-center">
              <img
                src={token.tokenUrl}
                alt={"logo"}
                width={20}
                className="mr-2"
              />
              <span className="text-sm text-light-emphasis font-medium leading-normal md:text-xsm md:ml-2">
                {token.denom}
              </span>
            </div>
          ) : (
            <Spinner size={"small"} />
          )
        }
        dropDownButtonClass="cursor-pointer py-3 px-4 bg-black-600 justify-between text-[12px] text-light-emphasis rounded-md"
        dropdownType={"click"}
        staticBackDrop={false}
        dropDownIcon={true}
        dropDownContentClass="!bg-[#282828] drop-shadow-md round-md
                       py-1 md:p-0"
      >
        {balances.allBalances.map((item: BalanceList, index: number): any =>
          item.denom !==
          ((token && token.denom) || balances.allBalances[0].denom) ? (
            <div key={index}>
              <div
                className="px-4 py-2 flex items-center md:py-3
                        hover:cursor-pointer hover:bg-[#383838] text-dark-high whitespace-nowrap"
                key={1}
                onClick={() => {
                  dropDownHandler(item);
                }}
              >
                <div className="flex justify-between w-full">
                  <div className="flex items-center">
                    <img
                      src={item.tokenUrl}
                      alt={"logo"}
                      width={20}
                      className="mr-2"
                    />
                    <span
                      className="text-sm text-light-emphasis font-medium leading-normal md:text-xsm md:ml-2"
                      title={item.minimalDenom}
                    >
                      {item.denom === "Unknown"
                        ? `${item.denom}(${stringTruncate(item.minimalDenom)})`
                        : item.denom}
                    </span>
                  </div>
                  <p className="text-sm text-light-emphasis font-medium leading-normal md:text-xsm md:ml-2">
                    {item.amount instanceof CoinPretty
                      ? item.amount.toString()
                      : getDecimalize(item.amount.toString(), 6)
                          .truncate()
                          .toString()}
                  </p>
                </div>
              </div>
            </div>
          ) : null
        )}
      </Dropdown>
    </div>
  );
};

export default Token;