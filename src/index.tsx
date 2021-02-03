import 'bulmaswatch/superhero/bulmaswatch.min.css';
import CodeCell from './components/code-cell'
import ReactDOM from 'react-dom'
// Another task is the bundling in-Browser process;
//whenever we see the import statements in the given code we have to to get access to those packages;
// 1) Now the there is option to to create a server API to and we ask them to always request a package whenever there is a import statet=ment;
// 2) But another option is to do in-Browser bundling;
//  and this is done by going to the specific package's index.js file(the package we want to import) and downloading that package;
// 3) Now, to download some npm package directly from the browser we will face some cors error and to get rid of those error we will use some third party called 'unpkg.com/{package name}'

const App = () => {

    return (
        <div>
            <CodeCell />
        </div>
    );
}

ReactDOM.render(
    <App />,
    document.querySelector('#root')
)