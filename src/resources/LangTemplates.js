export default function getLangTemplate(lang) {
    let langLower = lang.toLowerCase();

    switch (langLower) {
        case "c":
            return (
`#include <stdio.h>
int main() {
    printf("Hello World\\n");
    return 0;
}`          );

        case "cpp":
            return (
`#include <iostream>
using namespace std;

int main() {
    cout << "Hello World" << endl;
    return 0;
}`          );
        
        case "python":
            return (
`print("Hello World")`
            );
        
        case "haskell":
            return (
`main :: IO ()
main = putStrLn "hello world"`
            );
        
        default:
            return ""
    }
}
