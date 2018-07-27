#include <iostream>
using namespace std;
int* add( int* a){
    for(int i = 0; i < 5; i++)
        a[i]++;
    return a;
}

int main() {
  int a[5] = {1,2,3,4,5};
  int *b;
  b = add(a);
  for(int i = 0; i < 5; i++)
    cout << b[i] << endl;
  return 0;
}
