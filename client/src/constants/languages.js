export const LANGUAGES = [
  { id: "c",      name: "C"      },
  { id: "cpp",    name: "C++"    },
  { id: "csharp", name: "C#"     },
  { id: "java",   name: "Java"   },
  { id: "python", name: "Python" },
];

export const MONACO_LANGUAGE_MAP = {
  c:      "c",
  cpp:    "cpp",
  csharp: "csharp",
  java:   "java",
  python: "python",
};

export const STARTER_CODE = {
  c: `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`,

  cpp: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`,

  csharp: `using System;

class Program {
    static void Main(string[] args) {
        Console.WriteLine("Hello, World!");
    }
}`,

  java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,

  python: `def greet(name):
    print(f"Hello, {name}!")

greet("World")`,
};