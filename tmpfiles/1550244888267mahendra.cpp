#include<iostream>
using namespace std;
int  main(){
string s;
cin>>s;
cout<<s<<endl;
int x;
cin>>x;
int arr[x];
for(int i=0;i<x;i++)
cin>>arr[i];
for(int i=0;i<x;i++)
cout<<arr[i]<<" ";
return 0;
}