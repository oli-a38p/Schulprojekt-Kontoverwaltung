let AccountDeletionProc = function () {
    let eForm = $('#account-deletion-form').dxForm({
        colCount: 1,
        items: [{
            itemType: 'group',
            caption: 'Kontolöschun',
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
                    text: 'Löschen',
                    useSubmitBehavior: true
                }
            }]
        }]
    }).dxForm('instance');

    $('#account-deletion-form-container').on('submit', function(e) {
        // Daten abholen
        let iAccountID = eForm.getEditor('accountID').option('value');
        let aAccount = accManager.GetAccount(iAccountID);

        if (aAccount != null) {
            let sName = aAccount.Name;
            let sOwner = aAccount.Owner;

            accManager.RemoveAccount(iAccountID);
            eForm.getEditor('accountID').option('dataSource', accManager.AccountSelectionValues);

            $('#result-accountName').text(sName);
            $('#result-accountOwner').text(sOwner);
            $('#result').show();
        }

        // Standardevent verhindern
        e.preventDefault();
    });
};