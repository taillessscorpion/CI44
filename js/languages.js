const languages = {};
languages.activeLanguage = '';
languages.checkActiveLanguage = () => {
        languages.activeLanguage = document.getElementById('language-selected').options[document.getElementById('language-selected').selectedIndex].value;
}
languages.placeHolder = (placeHolderName) => {
    languages.checkActiveLanguage();
    switch (placeHolderName) {
        case 'firstName' :
            switch (languages.activeLanguage) {
                case 'languageViet':
                    return 'Tên...';
                case 'languageEngl':
                    return 'First name...';
            }
    }
}

