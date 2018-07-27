        // 内存管理
        const memory = new WebAssembly.Memory({ initial: 256, maximum: 256 });
        // WebAssembly实例对象的环境配置
        const importObj = {
            'global': {},
            env: {
                abortStackOverflow: () => { throw new Error('overflow'); },
                table: new WebAssembly.Table({ initial: 0, maximum: 0, element: 'anyfunc' }),
                tableBase: 0,
                memory: memory,
                memoryBase: 1024,
                STACKTOP: 0,
                STACK_MAX: memory.buffer.byteLength,
            }
        };

        var CModule;

        fetch('test2.wasm', { credentials: 'same-origin' }).then(res => {
            return res.arrayBuffer()
        }).then(bytes => {
            console.log('bytes:', bytes)
            // 利用WebAssembly.instantiate接口将wasm模块的方法与importObject进行映射
            return WebAssembly.instantiate(bytes, importObj)
        }).then(obj => {
            console.log('obj:', obj)
            // 执行调用factorial
            CModule = obj.instance.exports;
        })

        function factorial(num) {
            var num = document.getElementById('Input').value;
            var val = CModule._Z9factoriali(num)
            document.getElementById('Dispaly').innerHTML = `结果：${val}`;
            // setTimeout(console.log(val),50000);
        }
        // factorial(10);
        // setTimeout(factorial(10),50000);