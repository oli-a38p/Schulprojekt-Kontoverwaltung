$(() => {
    let accManager = new AccountManager();

    let AccountCreationProc = function () {
        // Eingabeformular für Kontoerstellung
        let eForm = $('#account-creation-form').dxForm({
            colCount: 1,
            items: [{
                itemType: 'group',
                caption: 'Konto erstellen',
                colCount: 1,
                items: [{
                    dataField: 'accountType',
                    isRequired: true,
                    editorType: 'dxSelectBox',
                    editorOptions: {
                        // Datenquelle
                        dataSource: new DevExpress.data.DataSource({
                            store: AccountTypesVisible,
                            paginate: true,
                            pageSize: 10,
                            sort: [  
                                { desc: false }  
                            ] 
                        }),
                        searchEnabled: true
                    },
                    label: {
                        text: 'Kontotyp'
                    },
                    validationRules: [{ type: 'required' }]
                }, {
                    dataField: 'accountName',
                    editorType: 'dxTextBox',
                    label: {
                        text: 'Kontoname'
                    },
                    validationRules: [{ type: 'required' }]
                }, {
                    dataField: 'accountOwner',
                    editorType: 'dxTextBox',
                    label: {
                        text: 'Kontoinhaber'
                    },
                    validationRules: [{ type: 'required' }]
                }, {
                    // Button für Bestätigung

                    itemType: 'button',
                    buttonOptions: {
                        text: 'Konto anlegen',
                        useSubmitBehavior: true
                    }
                }]
            }]
        }).dxForm('instance');

        $('#account-creation-form-container').on('submit', function(e) {
            // Fahrplandaten abholen
            let sAccountType = eForm.getEditor('accountType').option('value');
            let sAccountOwner = eForm.getEditor('accountOwner').option('value');
            let sAccountName = eForm.getEditor('accountName').option('value');
            let atAccountType = AccountTypeName.indexOf(sAccountType);

            if (accManager.AddAccount(atAccountType, sAccountOwner, sAccountName)) {
                $(() => {
                    DevExpress.ui.notify('Konto erfolgreich angelegt.', 'info');
                });
            } else {
                $(() => {
                    DevExpress.ui.notify('Das Konto konnte nicht angelegt werden. (' + accManager.LastError + ')', 'error');
                });
            }

            // Standardevent verhindern
            e.preventDefault();
        });
    }

    const aTabs = [
        {
            id: 0,
            text: 'Neues Konto anlegen',
            icon: 'user',
            content: '<form id="account-creation-form-container"><div id="account-creation-form"></div></form>',
            func: AccountCreationProc
        }, {
            id: 1,
            text: 'Kontoauszug',
            icon: 'doc',
            content: 'Kontoauszug'
        }, {
            id: 2,
            text: 'Einzahlung',
            icon: 'add',
            content: 'Einzahlung'
        }, {
            id: 3,
            text: 'Auszahlung',
            icon: 'minus',
            content: 'Auszahlung'
        }, {
            id: 4,
            text: 'Konto löschen',
            icon: 'remove',
            content: 'Konto '
        }
    ];

    const eTabs = $('#tabs > .tabs-container').dxTabs({
        dataSource: aTabs,
        selectedIndex: 0,
        onItemClick(e) {
            $('#tab-content').html(e.itemData.content);
            e.itemData.func();
        },
    }).dxTabs('instance');
});