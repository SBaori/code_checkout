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

        case "c++20":
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
main = putStrLn "Hello World"`
            );
        
        case "javascript":
            return (
`console.log("Hello World");`
            );
        
        case "java":
            return (
`public class Main {
    public static void main(String[] args) {
        System.out.println("Hello World!");
    }
}`
            )
        
        default:
            return ""
    }
}
