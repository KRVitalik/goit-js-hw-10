import './css/styles.css';
import { fetchCountries } from './fetchCountries.js';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const onInput = document.querySelector('#search-box');
const list = document.querySelector('.country-list');
const info = document.querySelector('.country-info');
let placeholder = onInput.placeholder = 'Enter country';

onInput.addEventListener('input', debounce(onInputForm, DEBOUNCE_DELAY));

Notiflix.Notify.init({
    position: 'center-center',
    showOnlyTheLastOne: true,
})

function onInputForm() {
    isInputEmpty();
    fetchCountries(onInput.value.trim())
        .then((data) => {
            isCountryOverTen(data);
            isOneCountry(data);
        })
        .catch((err) => {
            console.log(err);
            Notiflix.Notify.failure('Oops, there is no country with that name');
        });
};

    function createMarkup(arr) {
        return arr.map(({ flags, name }) => `<li>
        <img width='200px' src="${flags.svg}" alt="${flags.alt}" />
        <h2 id="flags">${name.official}</h2>
    </li>`).join('');
};

        function createMarkupInformation(arr) {
    return arr.map(({population, capital, languages}) =>`<p>Capital: ${capital}</p>
        <p>Population: ${population}</p><p>Languages: ${Object.values(languages).join(', ')}</p>`).join('')
};
    
    function isInputEmpty() {
        if (placeholder)
            placeholder
        list.innerHTML = ''
        info.innerHTML = ''
};

function isCountryOverTen(data) {
    if (data.length > 10) {
        Notiflix.Notify.info(`Too many matches found - ${data.length}. Please enter a more specific name.`);
        return
    } else {
        list.innerHTML = createMarkup(data);
        if (data.length <= 10 && data.length > 1) {
            Notiflix.Notify.info('You can "click" on country name');
            autocompleteInput();
        };
    };
};

function isOneCountry(data) {
    if (data.length > 1) {
        info.innerHTML = '';
        return
    };
    info.innerHTML = createMarkupInformation(data);
};

function autocompleteInput() {
    const nameTargets = document.querySelectorAll('#flags');

  nameTargets.forEach((nameTarget) => {
    nameTarget.addEventListener('click', currentCountry);
  });
}

function currentCountry(e) {
    onInput.value = e.target.textContent;
    isInputEmpty(onInput);
    onInputForm();
    return
};