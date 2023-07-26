import React, { useEffect, useState } from "react";
import DataTable from "../../../../components/DataTable";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { decimalize } from "../../../../utils/scripts";
import ButtonSend from "./ButtonSend";
import { showTokenizedActionModal } from "../../../../store/actions/transactions/redeemShares";

const TokenizedShares = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [list, setList] = useState([]);

  const balances = useSelector((state) => state.balance.list);

  const handleModal = () => {
    dispatch(showTokenizedActionModal());
  };

  useEffect(() => {
    if (balances.length > 0) {
      const tokenizedList = balances.filter((item) =>
        item.denom.startsWith("persistence")
      );
      setList(tokenizedList);
    }
  }, [balances]);

  const columns = [
    {
      name: "number",
      label: "Number"
    },
    {
      name: "denom",
      label: "Denom"
    },
    {
      name: "amount",
      label: "Amount"
    },
    {
      name: "actions",
      label: t("ACTIONS"),
      options: { sort: false }
    }
  ];

  const tableData = list.length
    ? list.map((item, index) => [
        <div key={index} className="validator-name d-flex">
          {index++}
        </div>,
        <div className="voting" key={index}>
          {item.denom}
        </div>,

        <div className="actions-td" key={index}>
          {decimalize(item.amount, 6)}
        </div>,
        <div className="actions-td" key={index}>
          <button
            onClick={() => handleModal()}
            className="button button-primary"
          >
            Actions
          </button>
        </div>
      ])
    : [];

  const options = {
    responsive: "standard",
    filters: false,
    pagination: false,
    selectableRows: "none",
    sort: false,
    print: false,
    download: false,
    filter: false,
    viewColumns: false,
    search: false
  };

  return (
    <div className="txns-container delegated-validators transfer">
      <DataTable columns={columns} data={tableData} name="" options={options} />
      <ButtonSend tokenizedShares={list} />
    </div>
  );
};

export default TokenizedShares;
