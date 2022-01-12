import {
    Accordion,
    AccordionContext,
    Card,
    Form,
    Modal,
    OverlayTrigger,
    Popover,
    useAccordionToggle
} from 'react-bootstrap';
import React, {useContext, useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";
import transactions from "../../../utils/transactions";
import {connect} from "react-redux";
import Icon from "../../../components/Icon";
import helper from "../../../utils/helper";

import Loader from "../../../components/Loader";
import ModalViewTxnResponse from "../../Common/ModalViewTxnResponse";
import config from "../../../config";
import {fee as feeMessage} from "../../../utils/aminoMsgHelper";
import {ADDRESS, ENCRYPTED_MNEMONIC} from "../../../constants/localStorage";


const ModalDecryptKeyStore = (props) => {
    const {t} = useTranslation();
    const [errorMessage, setErrorMessage] = useState("");
    const [advanceMode, setAdvanceMode] = useState(false);
    const [importMnemonic, setImportMnemonic] = useState(false);
    const [loader, setLoader] = useState(false);
    const loginAddress = localStorage.getItem(ADDRESS);
    const [response, setResponse] = useState('');

    useEffect(() => {
        const encryptedMnemonic = localStorage.getItem(ENCRYPTED_MNEMONIC);
        if (encryptedMnemonic !== null) {
            setImportMnemonic(false);
        } else {
            setImportMnemonic(true);
        }
    }, []);

    function ContextAwareToggle({eventKey, callback}) {
        const currentEventKey = useContext(AccordionContext);

        const decoratedOnClick = useAccordionToggle(
            eventKey,
            () => callback && callback(eventKey),
        );
        const handleAccordion = (event) => {
            decoratedOnClick(event);
            setAdvanceMode(!advanceMode);
        };
        const isCurrentEventKey = currentEventKey === eventKey;

        return (
            <button
                type="button"
                className="accordion-button"
                onClick={handleAccordion}
            >
                {isCurrentEventKey ?
                    <Icon
                        viewClass="arrow-right"
                        icon="up-arrow"/>
                    :
                    <Icon
                        viewClass="arrow-right"
                        icon="down-arrow"/>}

            </button>
        );
    }

    const handleSubmit = async event => {
        setLoader(true);
        event.preventDefault();
        let mnemonic;
        let accountNumber = 0;
        let addressIndex = 0;
        let bip39Passphrase = "";
        if (advanceMode) {
            accountNumber = event.target.delegateAccountNumber.value;
            addressIndex = event.target.delegateAccountIndex.value;
            bip39Passphrase = event.target.delegatebip39Passphrase.value;
        }

        if (importMnemonic) {
            let fileInput =
                document.getElementById('decryptFile');

            let filePath = fileInput.value;
            if (helper.fileTypeCheck(filePath)) {
                const password = event.target.password.value;
                if (helper.passwordValidation(password)) {
                    let promise = transactions.PrivateKeyReader(event.target.uploadFile.files[0], password, accountNumber, addressIndex, bip39Passphrase, loginAddress);
                    await promise.then(function (result) {
                        mnemonic = result;
                    }).catch(err => {
                        setLoader(false);
                        setErrorMessage(err);
                    });
                } else {
                    setErrorMessage("Password must be greater than 3 letters and no spaces allowed");
                }
            } else {
                setErrorMessage("File type not supported");
            }
        } else {
            const password = event.target.password.value;
            const encryptedMnemonic = localStorage.getItem(ENCRYPTED_MNEMONIC);
            const res = JSON.parse(encryptedMnemonic);
            const decryptedData = helper.decryptStore(res, password);
            if (decryptedData.error != null) {
                setLoader(false);
                setErrorMessage(decryptedData.error);
            } else {
                mnemonic = helper.mnemonicTrim(decryptedData.mnemonic);
                setErrorMessage("");
            }
        }
        if (mnemonic !== undefined) {
            const accountData = await transactions.MnemonicWalletWithPassphrase(mnemonic, transactions.makeHdPath(), bip39Passphrase);
            const address = accountData[1];

            if (address === loginAddress) {
                setImportMnemonic(false);
                let response;
                if (props.formData.formName === "ibc") {
                    let msg = transactions.MakeIBCTransferMsg(props.formData.channelID, address,
                        props.formData.toAddress, (props.formData.amount * config.xprtValue).toFixed(0), undefined, undefined, props.formData.denom, props.formData.channelUrl, props.formData.inputPort);
                    await msg.then(result => {
                        response = transactions.TransactionWithMnemonic([result],
                            feeMessage(Math.trunc(props.fee), props.gas), props.formData.memo, mnemonic,
                            transactions.makeHdPath(accountNumber, addressIndex), bip39Passphrase);
                    }).catch(err => {
                        setLoader(false);
                        setErrorMessage(err.response
                            ? err.response.data.message
                            : err.message);
                    });
                } else {
                    response = transactions.getTransactionResponse(address, props.formData, props.fee, props.gas, mnemonic, accountNumber, addressIndex, bip39Passphrase);
                }
                if (response !== undefined) {
                    response.then(result => {
                        setResponse(result);
                        setLoader(false);
                        setAdvanceMode(false);
                    }).catch(err => {
                        console.log(err.response
                            ? err.response.data.message
                            : err.message);
                        setLoader(false);
                        setErrorMessage(err.message);
                    });
                }
            } else {
                setLoader(false);
                setErrorMessage(t("ADDRESS_NOT_MATCHED_ERROR"));
            }
        } else {
            setLoader(false);
        }
    };

    if (loader) {
        return <Loader/>;
    }
    const popover = (
        <Popover id="popover-basic">
            <Popover.Content>
                {t("DELEGATE_HEADER_HINT")}
                <p><b>Note:</b> {t("DELEGATE_HEADER_HINT_NOTE")} </p>
            </Popover.Content>
        </Popover>
    );

    const handlePrevious = () => {
        props.setShowDecryptModal(false);
        props.setFeeModal(true);
    };

    const handleUpdateKeystore = () => {
        setImportMnemonic(true);
        localStorage.removeItem(ENCRYPTED_MNEMONIC);
    };

    const handleAccountNumberKeypress = e => {
        if (e.key === "e" || e.key === "-" || e.key === "+") {
            e.preventDefault();
        } else {
            const accountNumber = document.getElementById('delegateAccountNumber').value;
            if (parseInt(accountNumber) > config.maxAccountIndex || parseInt(accountNumber) < 0) {
                e.preventDefault();
            }
        }
    };

    const handleIndexKeypress = e => {
        if (e.key === "e" || e.key === "-" || e.key === "+") {
            e.preventDefault();
        } else {
            const addressIndex = document.getElementById('delegateAccountIndex').value;
            if (parseInt(addressIndex) > config.maxAccountIndex || parseInt(addressIndex) < 0) {
                e.preventDefault();
            }
        }
    };

    return (
        <>
            {
                response === '' ?
                    <>
                        <Modal.Header closeButton>
                            <div className="previous-section txn-header">
                                <button className="button" onClick={() => handlePrevious()}>
                                    <Icon
                                        viewClass="arrow-right"
                                        icon="left-arrow"/>
                                </button>
                            </div>
                            <h3 className="heading">
                                {props.formData.formName === "delegate" ?
                                    <>
                                        {props.formData.modalHeader}
                                        <OverlayTrigger trigger={['hover', 'focus']} placement="bottom"
                                            overlay={popover}>
                                            <button className="icon-button info" type="button"><Icon
                                                viewClass="arrow-right"
                                                icon="info"/></button>
                                        </OverlayTrigger>
                                    </>
                                    : props.formData.modalHeader}
                            </h3>
                        </Modal.Header>
                        <Modal.Body className="create-wallet-body import-wallet-body modal-body">
                            <Form onSubmit={handleSubmit}>
                                {
                                    importMnemonic ?
                                        <>
                                            <div className="form-field upload">
                                                <p className="label">  {t("KEY_STORE_FILE")}</p>
                                                <Form.File id="decryptFile" name="uploadFile"
                                                    className="file-upload" accept=".json" required={true}/>
                                            </div>
                                            <div className="form-field">
                                                <p className="label">{t("KEY_STORE_PASSWORD")}</p>
                                                <Form.Control
                                                    type="password"
                                                    name="password"
                                                    placeholder={t("ENTER_PASSWORD")}
                                                    required={true}
                                                />
                                            </div>

                                        </>
                                        :
                                        <>
                                            <div className="form-field">
                                                <p className="label">{t("KEY_STORE_PASSWORD")}</p>
                                                <Form.Control
                                                    type="password"
                                                    name="password"
                                                    placeholder={t("ENTER_PASSWORD")}
                                                    required={true}
                                                />
                                            </div>
                                        </>

                                }

                                <Accordion className="advanced-wallet-accordion">
                                    <Card>
                                        <Card.Header>
                                            <p>
                                                {t("ADVANCED")}
                                            </p>
                                            <ContextAwareToggle eventKey="0">Click me!</ContextAwareToggle>
                                        </Card.Header>
                                        <Accordion.Collapse eventKey="0">
                                            <>
                                                <div className="form-field">
                                                    <p className="label">{t("ACCOUNT")}</p>
                                                    <Form.Control
                                                        type="number"
                                                        max={config.maxAccountIndex}
                                                        name="delegateAccountNumber"
                                                        id="delegateAccountNumber"
                                                        placeholder={t("ACCOUNT_NUMBER")}
                                                        onKeyPress={handleAccountNumberKeypress}
                                                        required={advanceMode ? true : false}
                                                    />
                                                </div>
                                                <div className="form-field">
                                                    <p className="label">{t("ACCOUNT_INDEX")}</p>
                                                    <Form.Control
                                                        type="number"
                                                        max={config.maxAccountIndex}
                                                        name="delegateAccountIndex"
                                                        id="delegateAccountIndex"
                                                        placeholder={t("ACCOUNT_INDEX")}
                                                        onKeyPress={handleIndexKeypress}
                                                        required={advanceMode ? true : false}
                                                    />
                                                </div>
                                                <div className="form-field">
                                                    <p className="label">{t("BIP_PASSPHRASE")}</p>
                                                    <Form.Control
                                                        type="password"
                                                        name="delegatebip39Passphrase"
                                                        id="delegatebip39Passphrase"
                                                        placeholder={t("ENTER_BIP_PASSPHRASE")}
                                                        required={false}
                                                    />
                                                </div>
                                            </>
                                        </Accordion.Collapse>
                                        {
                                            errorMessage !== "" ?
                                                <p className="form-error">{errorMessage}</p>
                                                : null
                                        }
                                    </Card>
                                </Accordion>
                                {
                                    !importMnemonic ?
                                        <div className="buttons">
                                            <p className="button-link"
                                                onClick={handleUpdateKeystore}>
                                                {t("CHANGE_KEY_STORE")}
                                            </p>
                                        </div>
                                        : null
                                }
                                <div className="buttons">
                                    <button className="button button-primary">{t("SUBMIT")}</button>
                                </div>
                            </Form>
                        </Modal.Body>
                    </>
                    :
                    <ModalViewTxnResponse
                        response={response}
                        successMsg={props.formData.successMsg}
                        failedMsg={props.formData.failedMsg}
                        handleClose={props.handleClose}
                    />
            }
        </>
    );
};


const stateToProps = (state) => {
    return {
        balance: state.balance.amount,
        tokenPrice: state.tokenPrice.tokenPrice,
        transferableAmount: state.balance.transferableAmount,
    };
};

export default connect(stateToProps)(ModalDecryptKeyStore);
