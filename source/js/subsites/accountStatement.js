let AccountStatementProc = function () {
    // Eingabeformular für Kontoauszug
    let eForm = $('#account-statement-form').dxForm({
        colCount: 1,
        items: [{
            itemType: 'group',
            caption: 'Kontoauszug erstellen',
            colCount: 1,
            items: [{
                dataField: 'accountID',
                isRequired: true,
                editorType: 'dxSelectBox',
                editorOptions: {
                    // Datenquelle
                    dataSource: new DevExpress.data.DataSource({
                        store: accManager.AccountSelectionValues,
                        paginate: true,
                        pageSize: 10,
                        sort: [  
                            { desc: false }  
                        ] 
                    }),
                    valueExpr: 'ID',
                    displayExpr: 'displayText',
                    searchEnabled: true
                },
                label: {
                    text: 'Konto auswählen'
                },
                validationRules: [{ type: 'required' }]
            }, {
                // Button für Bestätigung

                itemType: 'button',
                buttonOptions: {
                    text: 'Kontoauszug erstellen',
                    useSubmitBehavior: true
                }
            }]
        }]
    }).dxForm('instance');

    $('#account-statement-form-container').on('submit', function(e) {
        // Daten abholen
        let iAccountID = eForm.getEditor('accountID').option('value');
        let aAccount = accManager.GetAccount(iAccountID);

        if (aAccount != null) {
            $('#result-accountID').text(aAccount.ID);
            $('#result-accountType').text(AccountTypeName[aAccount.Type]);
            $('#result-accountCreationDate').text(aAccount.CreationDateString);
            $('#result-accountName').text(aAccount.Name);
            $('#result-accountOwner').text(aAccount.Owner);
            $('#result-accountBalance').text(aAccount.Balance.toFixed(2) + ' EUR');
            $('#result').show();
        } else {
            $('#result').hide();
        }

        // Standardevent verhindern
        e.preventDefault();
    });
};