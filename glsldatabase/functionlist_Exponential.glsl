int D_pow(int a, int b)
{
    int ans = 1;
    for (int i = 0; i < 16; i++) {
        ans = D_multiple(ans, a);
    }
    return ans;
}