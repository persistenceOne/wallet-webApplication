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
import success from "../../../assets/images/success.svg";
// import MenuItem from '@material-ui/core/MenuItem';
// import Select from '@material-ui/core/Select';
import Icon from "../../../components/Icon";
import {connect} from "react-redux";
import helper from "../../../utils/helper";
import Loader from "../../../components/Loader";
import {WithdrawMsg} from "../../../utils/protoMsgHelper";
import {ValidatorCommissionMsg} from "../../../utils/protoMsgHelper";
import aminoMsgHelper from "../../../utils/aminoMsgHelper";
import transactions from "../../../utils/transactions";
import MakePersistence from "../../../utils/cosmosjsWrapper";
import {useTranslation} from "react-i18next";
import ModalSetWithdrawAddress from "../ModalSetWithdrawAddress";
import config from "../../../config";
import GasContainer from "../../Gas";
import {fetchValidatorsWithAddress} from "../../../actions/validators";
import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes';
import ModalViewValidatorRewards from "../ModalViewValidatorRewards";

const EXPLORER_API = process.env.REACT_APP_EXPLORER_API;

const ModalWithdraw = (props) => {
    const {t} = useTranslation();
    const [show, setShow] = useState(true);
    const [response, setResponse] = useState('');
    const [advanceMode, setAdvanceMode] = useState(false);
    const [initialModal, setInitialModal] = useState(true);
    const [seedModal, showSeedModal] = useState(false);
    const [individualRewards, setIndividualRewards] = useState(0);
    const [memoContent, setMemoContent] = useState('');
    const [errorMessage, setErrorMessage] = useState("");
    const [loader, setLoader] = useState(false);
    const [importMnemonic, setImportMnemonic] = useState(true);
    const [withdraw, setWithDraw] = useState(false);
    const loginAddress = localStorage.getItem('address');
    const mode = localStorage.getItem('loginMode');
    const [memoStatus, setMemoStatus] = useState(false);
    const [showGasField, setShowGasField] = useState(false);
    const [activeFeeState, setActiveFeeState] = useState("Average");
    const [gas, setGas] = useState(config.gas);
    const [gasValidationError, setGasValidationError] = useState(false);
    const [fee, setFee] = useState(config.averageFee);
    const [zeroFeeAlert, setZeroFeeAlert] = useState(false);
    const [selectValidation, setSelectValidation] = useState(false);
    const [checkAmountError, setCheckAmountError] = useState(false);
    const [withDrawMsgs, setWithDrawMsgs] = useState({});
    const [commissionMsg, setCommissionMsg] = useState({});
    const [showRewardsModal, setShowRewardsModal] = useState(false);
    
    const handleMemoChange = () => {
        setMemoStatus(!memoStatus);
    };
    useEffect(() => {
        props.fetchValidatorsWithAddress(props.list, loginAddress);
        const encryptedMnemonic = localStorage.getItem('encryptedMnemonic');
        if (encryptedMnemonic !== null) {
            setImportMnemonic(false);
        } else {
            setImportMnemonic(true);
        }
        setFee(gas*fee);
        if(props.transferableAmount < transactions.XprtConversion(gas*fee)){
            setCheckAmountError(true);
        }else{
            setCheckAmountError(false);
        }

    }, []);

    const handleClose = () => {
        setShow(false);
        props.setRewards(false);
    };

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

    const handleSubmitKepler = async event => {
        setLoader(true);
        event.preventDefault();
        let messages  = [];
        if(withDrawMsgs.length){
            messages = withDrawMsgs;
        }
        if(commissionMsg.length){
            messages.push(commissionMsg[0]);
        }
        const response = transactions.TransactionWithKeplr(messages, aminoMsgHelper.fee(0, 250000));
        response.then(result => {
            if (result.code !== undefined) {
                helper.accountChangeCheck(result.rawLog);
            }
            setInitialModal(false);
            setResponse(result);
            setLoader(false);
        }).catch(err => {
            setLoader(false);
            helper.accountChangeCheck(err.message);
            setErrorMessage(err.message);
        });
    };
    const handleSubmitInitialData = async event => {
        event.preventDefault();
        let memo = "";
        if (memoStatus) {
            memo = event.target.memo.value;
        }
        let memoCheck = helper.mnemonicValidation(memo, loginAddress);
        if (memoCheck) {
            setErrorMessage(t("MEMO_MNEMONIC_CHECK_ERROR"));
        } else {
            setErrorMessage("");
            setMemoContent(memo);
            setInitialModal(false);
            showSeedModal(true);
        }
        if(mode === "normal" && (localStorage.getItem("fee") * 1) === 0 ){
            setFee(0);
        }
    };
    const handleSubmit = async event => {
        setLoader(true);
        event.preventDefault();
        let mnemonic;
        let accountNumber = 0;
        let addressIndex = 0;
        let bip39Passphrase = "";
        if (advanceMode) {
            accountNumber = event.target.claimTotalAccountNumber.value;
            addressIndex = event.target.claimTotalAccountIndex.value;
            bip39Passphrase = event.target.claimTotalbip39Passphrase.value;
        }
        if (importMnemonic) {
            const password = event.target.password.value;
            let promise = transactions.PrivateKeyReader(event.target.uploadFile.files[0], password, accountNumber, addressIndex, bip39Passphrase, loginAddress);
            await promise.then(function (result) {
                mnemonic = result;
            }).catch(err => {
                setLoader(false);
                setErrorMessage(err);
            });
        } else {
            const password = event.target.password.value;
            const encryptedMnemonic = localStorage.getItem('encryptedMnemonic');
            const res = JSON.parse(encryptedMnemonic);
            const decryptedData = helper.decryptStore(res, password);
            if (decryptedData.error != null) {
                setErrorMessage(decryptedData.error);
            } else {
                mnemonic = decryptedData.mnemonic;
                setErrorMessage("");
            }
        }
        if (mnemonic !== undefined) {
            const persistence = MakePersistence(accountNumber, addressIndex);
            const address = persistence.getAddress(mnemonic, bip39Passphrase, true);
            const ecpairPriv = persistence.getECPairPriv(mnemonic, bip39Passphrase);
            if (address.error === undefined && ecpairPriv.error === undefined) {
                if (address === loginAddress) {
                    setImportMnemonic(false);
                    let messages  = [];
                    if(withDrawMsgs.length){
                        messages = withDrawMsgs;
                    }
                    if(commissionMsg.length){
                        messages.push(commissionMsg[0]);
                    }

                    const response = transactions.TransactionWithMnemonic(messages, aminoMsgHelper.fee(Math.trunc(fee), gas), memoContent,
                        mnemonic, transactions.makeHdPath(accountNumber, addressIndex), bip39Passphrase);
                    response.then(result => {
                        setResponse(result);
                        setLoader(false);
                        showSeedModal(false);
                        setAdvanceMode(false);
                    }).catch(err => {


                        setLoader(false);
                        setErrorMessage(err.response
                            ? err.response.data.message
                            : err.message);
                    });

                } else {
                    setLoader(false);
                    setAdvanceMode(false);
                    setErrorMessage(t("ADDRESS_NOT_MATCHED_ERROR"));
                }
            } else {
                if (address.error !== undefined) {
                    setLoader(false);
                    setAdvanceMode(false);
                    setErrorMessage(address.error);
                } else {
                    setLoader(false);
                    setAdvanceMode(false);
                    setErrorMessage(ecpairPriv.error);
                }
            }
        } else {
            setLoader(false);
        }
    };

    const onChangeSelect =  (evt) => {
        let totalValidatorsRewards = 0;
        let messages = [];
        evt.forEach(async (item) => {
            totalValidatorsRewards = totalValidatorsRewards + (transactions.XprtConversion(item.rewards*1));
            messages.push(WithdrawMsg(loginAddress, item.value));
        });
        setWithDrawMsgs(messages);
        setIndividualRewards(totalValidatorsRewards);
    };

    const handleGas = () =>{
        setShowGasField(!showGasField);
    };

    const handleGasChange = (event) =>{
        if((event.target.value * 1) >= 80000 && (event.target.value * 1) <= 2000000) {
            setGasValidationError(false);
            setGas(event.target.value * 1);
            if ((localStorage.getItem("fee") * 1) !== 0) {
                if (activeFeeState === "Average") {
                    setFee((event.target.value * 1) * config.averageFee);
                } else if (activeFeeState === "High") {
                    setFee((event.target.value * 1) * config.highFee);
                } else if (activeFeeState === "Low") {
                    setFee((event.target.value * 1) * config.lowFee);
                }

                if (activeFeeState === "Average" && (transactions.XprtConversion((event.target.value * 1) * config.averageFee)) > props.transferableAmount) {
                    setCheckAmountError(true);
                } else if (activeFeeState === "High" && (transactions.XprtConversion((event.target.value * 1) * config.highFee)) > props.transferableAmount) {
                    setCheckAmountError(true);
                } else if (activeFeeState === "Low" && (transactions.XprtConversion((event.target.value * 1) * config.lowFee)) > props.transferableAmount) {
                    setCheckAmountError(true);
                } else {
                    setCheckAmountError(false);
                }
            }
        }else {
            setGasValidationError(true);
        }
    };

    const handleFee = (feeType, feeValue)=>{
        if(feeType === "Low"){
            setZeroFeeAlert(true);
        }
        setActiveFeeState(feeType);
        setFee(gas*feeValue);
        if (props.transferableAmount < transactions.XprtConversion(gas*feeValue)) {
            setGasValidationError(true);
            setCheckAmountError(true);
        }else {
            setGasValidationError(false);
            setCheckAmountError(false);
        }
    };

    if (loader) {
        return <Loader/>;
    }

    const handleRewards = (key) => {
        if (key === "setWithDraw") {
            setWithDraw(true);
            setShow(false);
        }
    };

    const handlePrevious = () => {
        setInitialModal(true);
        showSeedModal(false);
    };
    
    const handleViewRewards = () =>{
        setShowRewardsModal(true);
        setShow(false);
    };

    const handleCommissionChange = (evt) =>{
        let messages = [];
        if(evt.target.checked){
            messages.push(ValidatorCommissionMsg(props.validatorCommissionInfo[1]));
            setSelectValidation(true);
        }else {
            messages = [];
            setSelectValidation(false);
        }
        setCommissionMsg(messages);

    };
    const popoverMemo = (
        <Popover id="popover-memo">
            <Popover.Content>
                {t("MEMO_NOTE")}
            </Popover.Content>
        </Popover>
    );

    const popoverSetupAddress = (
        <Popover id="popover-memo">
            <Popover.Content>
                {t("SETUP_ADDRESS_NOTE")}
            </Popover.Content>
        </Popover>
    );
    
    if (props.inProgress) {
        return <Loader/>;
    }

    const disable = (
        individualRewards === 0 && !selectValidation
    );
    return (
        <>
            <Modal
                animation={false}
                centered={true}
                backdrop="static"
                keyboard={false}
                show={show}
                className="modal-custom claim-rewards-modal"
                onHide={handleClose}>
                {initialModal ?
                    <>
                        <Modal.Header closeButton>
                            {t("CLAIM_STAKING_REWARDS")}
                        </Modal.Header>
                        <Modal.Body className="rewards-modal-body">
                            <Form onSubmit={mode === "kepler" ? handleSubmitKepler : handleSubmitInitialData}>
                                <div className="form-field">
                                    <p className="label">{t("TOTAL_AVAILABLE_BALANCE")}</p>
                                    <div className="available-tokens">
                                        <p className="tokens"
                                            title={props.totalRewards}>{props.totalRewards.toLocaleString()} XPRT</p>
                                        <p className="usd">= ${(props.totalRewards * props.tokenPrice).toLocaleString()}</p>
                                    </div>
                                </div>

                                <div className="form-field rewards-validators-list">
                                    <p className="label">{t("VALIDATOR")}</p>
                                    <ReactMultiSelectCheckboxes
                                        options={props.validatorsRewardsList}
                                        onChange={onChangeSelect}
                                        placeholderButtonLabel="Select"
                                    />

                                </div>
                                <div className="form-field p-0">
                                    <p className="label"></p>
                                    <div className="available-tokens">
                                        <p className="tokens">{t("CLAIMING_REWARDS")} {individualRewards.toLocaleString()} <span>XPRT</span></p>
                                        <p className="usd">= ${(individualRewards * props.tokenPrice).toLocaleString()}</p>
                                        <p className="view" onClick={handleViewRewards}>view</p>
                                    </div>
                                </div>
                                {props.validatorCommissionInfo[2] ?
                                    <div className="form-field claim-check-box">
                                        <p className="label"></p>
                                        <div className="check-box-container">
                                            <p className="label" title={`${transactions.XprtConversion(props.validatorCommissionInfo[0]*1)} uxprt`}>{t("Claim Commission")}({transactions.XprtConversion(props.validatorCommissionInfo[0]*1).toLocaleString()} XPRT)</p>
                                            <Form.Control
                                                type="checkbox"
                                                name="claimCommission"
                                                onChange={handleCommissionChange}
                                                required={false}
                                            />
                                        </div>
                                    </div>
                                    :""
                                }
                                <div className="form-field p-0">
                                    <p className="label"></p>
                                    <div className="validator-limit-warning">
                                        <p className="amount-warning">Warning: Select below 3 validators to claim</p>
                                    </div>
                                </div>
                                {mode === "normal" ?
                                    <div className="memo-container">
                                        <div className="memo-dropdown-section">
                                            <p onClick={handleMemoChange} className="memo-dropdown"><span
                                                className="text">{t("ADVANCED")} </span>
                                            {memoStatus ?
                                                <Icon
                                                    viewClass="arrow-right"
                                                    icon="up-arrow"/>
                                                :
                                                <Icon
                                                    viewClass="arrow-right"
                                                    icon="down-arrow"/>}
                                            </p>
                                            <OverlayTrigger trigger={['hover', 'focus']}
                                                placement="bottom"
                                                overlay={popoverMemo}>
                                                <button className="icon-button info" type="button"><Icon
                                                    viewClass="arrow-right"
                                                    icon="info"/></button>
                                            </OverlayTrigger>
                                        </div>
                                        {memoStatus ?
                                            <div className="form-field">
                                                <p className="label">{t("MEMO")}<OverlayTrigger
                                                    trigger={['hover', 'focus']}
                                                    placement="bottom"
                                                    overlay={popoverMemo}>
                                                    <button className="icon-button info" type="button"><Icon
                                                        viewClass="arrow-right"
                                                        icon="info"/></button>
                                                </OverlayTrigger></p>
                                                <Form.Control
                                                    type="text"
                                                    name="memo"
                                                    placeholder={t("ENTER_MEMO")}
                                                    maxLength={200}
                                                    required={false}
                                                />
                                            </div> : ""
                                        }
                                    </div> : null
                                }
                                {
                                    errorMessage !== "" ?
                                        <p className="form-error">{errorMessage}</p>
                                        : null
                                }

                                <div className="buttons">
                                    {mode === "normal" ?
                                        <div className="button-section">
                                            <GasContainer checkAmountError={checkAmountError} activeFeeState={activeFeeState} onClick={handleFee} gas={gas} zeroFeeAlert={zeroFeeAlert} setZeroFeeAlert={setZeroFeeAlert}/>
                                            <div className="select-gas">
                                                <p onClick={handleGas}>{!showGasField ? "Set gas" : "Close"}</p>
                                            </div>
                                            {showGasField
                                                ?
                                                <div className="form-field">
                                                    <p className="label info">{t("GAS")}</p>
                                                    <div className="amount-field">
                                                        <Form.Control
                                                            type="number"
                                                            min={80000}
                                                            max={2000000}
                                                            name="gas"
                                                            placeholder={t("ENTER_GAS")}
                                                            step="any"
                                                            defaultValue={gas}
                                                            onChange={handleGasChange}
                                                            required={false}
                                                        />
                                                        {
                                                            gasValidationError ?
                                                                <span className="amount-error">
                                                                    {t("GAS_WARNING")}
                                                                </span> : ""
                                                        }
                                                    </div>
                                                </div>
                                                : ""
                                            }
                                            <button className="button button-primary"
                                                disabled={checkAmountError || disable || gasValidationError}
                                            >{t("NEXT")}</button>
                                        </div>
                                        :
                                        <button className="button button-primary"
                                            disabled={checkAmountError || disable || individualRewards === 0}
                                        >{t("SUBMIT")}</button>
                                    }
                                </div>
                                <div className="buttons">
                                    <p className="button-link"
                                        onClick={() => handleRewards("setWithDraw")}>
                                        {t("SET_WITHDRAW_ADDRESS")}
                                        <OverlayTrigger trigger={['hover', 'focus']} placement="bottom"
                                            overlay={popoverSetupAddress}>
                                            <button className="icon-button info" type="button"><Icon
                                                viewClass="arrow-right"
                                                icon="info"/></button>
                                        </OverlayTrigger>
                                    </p>
                                </div>
                            </Form>
                        </Modal.Body>
                    </>
                    : null
                }
                {seedModal ?
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
                                {t("CLAIM_STAKING_REWARDS")}
                            </h3>
                        </Modal.Header>
                        <Modal.Body className="rewards-modal-body">
                            <Form onSubmit={handleSubmit}>
                                {
                                    importMnemonic ?
                                        <>
                                            <div className="form-field upload">
                                                <p className="label"> {t("KEY_STORE_FILE")}</p>
                                                <Form.File id="exampleFormControlFile1" name="uploadFile"
                                                    className="file-upload" accept=".json" required={true}/>
                                            </div>
                                            <div className="form-field">
                                                <p className="label">{t("PASSWORD")}</p>
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
                                                        type="text"
                                                        name="claimTotalAccountNumber"
                                                        id="claimTotalAccountNumber"
                                                        placeholder={t("ACCOUNT_NUMBER")}
                                                        required={advanceMode ? true : false}
                                                    />
                                                </div>
                                                <div className="form-field">
                                                    <p className="label">{t("ACCOUNT_INDEX")}</p>
                                                    <Form.Control
                                                        type="text"
                                                        name="claimTotalAccountIndex"
                                                        id="claimTotalAccountIndex"
                                                        placeholder={t("ACCOUNT_INDEX")}
                                                        required={advanceMode ? true : false}
                                                    />
                                                </div>
                                                <div className="form-field">
                                                    <p className="label">{t("BIP_PASSPHRASE")}</p>
                                                    <Form.Control
                                                        type="password"
                                                        name="claimTotalbip39Passphrase"
                                                        id="claimTotalbip39Passphrase"
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

                                <div className="buttons">
                                    <button className="button button-primary">{t("CLAIM_REWARDS")}</button>
                                </div>
                            </Form>
                        </Modal.Body>

                    </>
                    : null
                }
                {
                    response !== '' && response.code === 0 ?
                        <>
                            <Modal.Header className="result-header success" closeButton>
                                {t("SUCCESSFULLY_CLAIMED")}
                            </Modal.Header>
                            <Modal.Body className="delegate-modal-body">
                                <div className="result-container">
                                    <img src={success} alt="success-image"/>
                                    {mode === "kepler" ?
                                        <a
                                            href={`${EXPLORER_API}/transaction?txHash=${response.transactionHash}`}
                                            target="_blank" className="tx-hash" rel="noopener noreferrer">Tx
                                            Hash: {response.transactionHash}</a>
                                        :
                                        <a
                                            href={`${EXPLORER_API}/transaction?txHash=${response.transactionHash}`}
                                            target="_blank" className="tx-hash" rel="noopener noreferrer">Tx
                                            Hash: {response.transactionHash}</a>
                                    }
                                    <div className="buttons">
                                        <button className="button" onClick={handleClose}>{t("DONE")}</button>
                                    </div>
                                </div>
                            </Modal.Body>
                        </>
                        : null
                }
                {
                    response !== '' && response.code !== 0 ?
                        <>
                            <Modal.Header className="result-header error" closeButton>
                                {t("FAILED_CLAIMING")}
                            </Modal.Header>
                            <Modal.Body className="delegate-modal-body">
                                <div className="result-container">
                                    {mode === "kepler" ?
                                        <>
                                            <p>{response.rawLog}</p>
                                            <a
                                                href={`${EXPLORER_API}/transaction?txHash=${response.transactionHash}`}
                                                target="_blank" className="tx-hash" rel="noopener noreferrer">Tx
                                                Hash: {response.transactionHash}</a>
                                        </>
                                        :
                                        <>
                                            <p>{response.rawLog === "panic message redacted to hide potentially sensitive system info: panic" ? "You cannot send vesting amount" : response.rawLog}</p>
                                            <a
                                                href={`${EXPLORER_API}/transaction?txHash=${response.transactionHash}`}
                                                target="_blank" className="tx-hash" rel="noopener noreferrer">Tx
                                                Hash: {response.transactionHash}</a>
                                        </>
                                    }
                                    <div className="buttons">
                                        <button className="button" onClick={handleClose}>{t("DONE")}</button>
                                    </div>
                                </div>
                            </Modal.Body>
                        </>
                        : null
                }
            </Modal>
            {withdraw ?
                <ModalSetWithdrawAddress setWithDraw={setWithDraw} handleClose={handleClose}
                    totalRewards={props.rewards} setShow={setShow} formName="setAddress"/>
                : null
            }
            {
                showRewardsModal ?
                    <ModalViewValidatorRewards setShowRewardsModal={setShowRewardsModal} handleClose={handleClose} setShow={setShow} formName="viewRewards"/>
                    : null
            }
        </>
    );
};

const stateToProps = (state) => {
    return {
        list: state.rewards.list,
        rewards: state.rewards.rewards,
        balance: state.balance.amount,
        tokenPrice: state.tokenPrice.tokenPrice,
        transferableAmount: state.balance.transferableAmount,
        validatorsList:state.validators.validatorsListWithAddress,
        validatorsRewardsList:state.validators.validatorsRewardsList,
        inProgress:state.validators.rewardsInProgress,
        validatorCommissionInfo:state.validators.validatorCommissionInfo
    };
};

const actionsToProps = {
    fetchValidatorsWithAddress,
};

export default connect(stateToProps, actionsToProps)(ModalWithdraw);
