import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { FormattedMessage } from 'react-intl'
import Swal from 'sweetalert2'

@inject('accountStore')
@observer
class CreateAccountView extends Component {
  onInputChange = name => event => {
    const { accountStore } = this.props
    const validationValue = event.target.value

    if ('accoutname' === name) {
      accountStore.validateAccountName(validationValue)
    } else if ('ownerpubkey' === name) {
      accountStore.validateOwnerPubKey(validationValue)
    } else if ('activepubkey' === name) {
      accountStore.validateActivePubKey(validationValue)
    } else if ('cpustake' === name) {
      accountStore.validateCpuStake(validationValue)
    } else if ('netstake' === name) {
      accountStore.validateNetStake(validationValue)
    } else if ('rampurchase' === name) {
      accountStore.validateRamPurchaseOnCreation(validationValue)
    }
  }

  createAccount = () => {
    const { accountStore } = this.props
    if (!accountStore || !accountStore.account || !accountStore.accountInfo) return

    Swal({
      title: 'Create Account',
      text:
        'By executing this action you are agreeing to the EOS constitution and this actions associated ricardian contract.',
      showCancelButton: true,
      confirmButtonText: 'Create',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return accountStore
          .createNewAccount()
          .then(async response => {
            await accountStore.seedCreateAccountInput()
            return response
          })
          .catch(err => {
            if (err) {
              if (err.message) {
                Swal.showValidationError(err.message)
                return
              }

              const parsedResult = JSON.parse(err)

              if (parsedResult.error.details && parsedResult.error.details.length > 0) {
                Swal.showValidationError(parsedResult.error.details[0].message)
              } else {
                Swal.showValidationError(parsedResult.message)
              }
            } else {
              Swal.showValidationError(err)
            }
          })
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then(result => {
      if (result.value) {
        Swal('Good job!', 'Your transaction(s) have been submitted to the blockchain.', 'success')
      }
    })
  }

  render() {
    const { accountStore } = this.props
    const {
      isAccountNameValid,
      isOwnerPubKeyValid,
      isActivePubKeyValid,
      isCPUstakeValid,
      isNETstakeValid,
      isRAMpurchaseOnCreationValid,
      accountNameInput,
      ownerPubKeyInput,
      activePubKeyInput,
      cpuStakeInput,
      netStakeInput,
      ramPurchaseInput,
      transferInput
    } = accountStore

    const canSubmit =
      isAccountNameValid &&
      isOwnerPubKeyValid &&
      isActivePubKeyValid &&
      isCPUstakeValid &&
      isNETstakeValid &&
      isRAMpurchaseOnCreationValid
    const accountNameForm = isAccountNameValid ? 'form-group row' : 'form-group has-danger row'
    const ownerPublicKeyForm = isOwnerPubKeyValid ? 'form-group row' : 'form-group has-danger row'
    const activePublicKeyForm = isActivePubKeyValid ? 'form-group row' : 'form-group has-danger row'
    const cpuStakeForm = isCPUstakeValid ? 'form-group row' : 'form-group has-danger row'
    const netStakeForm = isNETstakeValid ? 'form-group row' : 'form-group has-danger row'
    const ramPurchaseForm = isRAMpurchaseOnCreationValid
      ? 'form-group row'
      : 'form-group has-danger row'

    return (
      accountStore &&
      accountStore.account &&
      accountStore.accountInfo && (
        <div className="col-sm-12">
          <div className="card">
            <div className="card-header">
              <h5>
                <FormattedMessage id="Create Account" />
              </h5>
              <span>
                Create your <code> new account</code> with <code>information</code> below
              </span>
            </div>
            <div className="card-block">
              <div className={accountNameForm}>
                <div className="col-sm-2">
                  <label className="col-form-label" htmlFor="newAccountInputDanger">
                    <FormattedMessage id="New account name" />
                  </label>
                </div>
                <div className="col-sm-10">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="12 characters, a-z, 1-5"
                    id="newAccountInputDanger"
                    value={accountNameInput}
                    onChange={this.onInputChange('accoutname')}
                  />

                  {!isAccountNameValid && (
                    <div className="col-form-label">
                      <FormattedMessage id="Invalid account name" />
                    </div>
                  )}
                </div>
              </div>

              <div className={ownerPublicKeyForm}>
                <div className="col-sm-2">
                  <label className="col-form-label" htmlFor="ownerPublicKeyInputDanger">
                    <FormattedMessage id="Owner public key" />
                  </label>
                </div>
                <div className="col-sm-10">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Owner pubkey is required"
                    id="ownerPublicKeyInputDanger"
                    value={ownerPubKeyInput}
                    onChange={this.onInputChange('ownerpubkey')}
                  />

                  {!isOwnerPubKeyValid && (
                    <div className="col-form-label">
                      <FormattedMessage id="Owner pubkey cannot be empty" />
                    </div>
                  )}
                </div>
              </div>

              <div className={activePublicKeyForm}>
                <div className="col-sm-2">
                  <label className="col-form-label" htmlFor="activePublicKeyInputDanger">
                    <FormattedMessage id="Active public key" />
                  </label>
                </div>
                <div className="col-sm-10">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Active pubkey is required"
                    id="activePublicKeyInputDanger"
                    value={activePubKeyInput}
                    onChange={this.onInputChange('activepubkey')}
                  />

                  {!isActivePubKeyValid && (
                    <div className="col-form-label">
                      <FormattedMessage id="Active pubkey cannot be empty" />
                    </div>
                  )}
                </div>
              </div>

              <div className={cpuStakeForm}>
                <div className="col-sm-2">
                  <label className="col-form-label" htmlFor="cpuStakeInputDanger">
                    <FormattedMessage id="CPU Stake (in EOS)" />
                  </label>
                </div>
                <div className="col-sm-10">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Required to process transaction"
                    id="cpuStakeInputDanger"
                    value={cpuStakeInput}
                    onChange={this.onInputChange('cpustake')}
                  />

                  {!isCPUstakeValid && (
                    <div className="col-form-label">
                      <FormattedMessage id="CPU Stake is requied" />
                    </div>
                  )}
                </div>
              </div>

              <div className={netStakeForm}>
                <div className="col-sm-2">
                  <label className="col-form-label" htmlFor="netStakeInputDanger">
                    <FormattedMessage id="NET Stake (in EOS)" />
                  </label>
                </div>
                <div className="col-sm-10">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Required to use network"
                    id="netStakeInputDanger"
                    value={netStakeInput}
                    onChange={this.onInputChange('netstake')}
                  />

                  {!isNETstakeValid && (
                    <div className="col-form-label">
                      <FormattedMessage id="NET Stake is requied" />
                    </div>
                  )}
                </div>
              </div>

              <div className={ramPurchaseForm}>
                <div className="col-sm-2">
                  <label className="col-form-label" htmlFor="ramPurchaseInputDanger">
                    <FormattedMessage id="RAM purchase (in bytes)" />
                  </label>
                </div>
                <div className="col-sm-10">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Required to store account"
                    id="ramPurchaseInputDanger"
                    value={ramPurchaseInput}
                    onChange={this.onInputChange('rampurchase')}
                  />

                  {!isRAMpurchaseOnCreationValid && (
                    <div className="col-form-label">
                      <FormattedMessage id="RAM purchase is required" />
                    </div>
                  )}
                </div>
              </div>

              <div className={ramPurchaseForm}>
                <div className="col-sm-2">
                  <label className="col-form-label">
                    <FormattedMessage id="Transfer" />
                  </label>
                </div>
                <div className="col-sm-10">
                  <span
                    className="switchery switchery-default"
                    style={{
                      backgroundColor: 'blue',
                      borderColor: 'white',
                      boxShadow: 'grey 0px 0px 0px 16px inset',
                      transition: 'border 0.4s, boxShadow 0.4s, backgroundColor 1.2s'
                    }}
                  >
                    <small style={{ marginLeft: '20px', backgroundColor: 'red' }} />
                  </span>
                </div>
              </div>

              <div className="row">
                <div className="col-lg-6 offset-lg-3">
                  <div className="card-block text-center">
                    <button
                      disabled={!canSubmit}
                      className="btn btn-success btn-md btn-round"
                      onClick={this.createAccount}
                    >
                      <FormattedMessage id="Create Account" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    )
  }
}

export default CreateAccountView
