#include <unordered_map>
#include <string>

using namespace std;

//global variable
unordered_map<string,int> mymap;

int main() {
  mymap.reserve(7000); // <-- try putting it here
  return 0;
}
