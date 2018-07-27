#include <stdio.h>

extern long factorial(int num) {
    if (num <= 0) return 1;
    else {
        return num * factorial(num - 1);
    } 
}

int main (int argc, char ** argv) {
    int num = factorial(10);
    printf("The Result: %d \n", num);
}