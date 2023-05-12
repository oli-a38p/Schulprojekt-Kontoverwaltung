let SysInfo = function () {
    $('#count-savingAccounts').text(accManager.SavingAccounts.AccountList.length);
    $('#count-maxSavingAccounts').text(accManager.SavingAccounts.TotalAvailableSpace);
    $('#count-checkingAccounts').text(accManager.CheckingAccounts.AccountList.length);
    $('#count-maxCheckingAccounts').text(accManager.CheckingAccounts.TotalAvailableSpace);
    $('#count-freeSavingAccounts').text(accManager.SavingAccounts.FreeSpace);
    $('#count-freeCheckingAccounts').text(accManager.CheckingAccounts.FreeSpace);

    $('#dx-version').text(DevExpress.VERSION);
}