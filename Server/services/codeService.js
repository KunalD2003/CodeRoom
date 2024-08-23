const compiler = require('compilex');

compiler.init({ stats: true });

const compileCode = ({ code, input, lang }) => {
  return new Promise((resolve, reject) => {
      let envData;
      switch (lang) {
          case 'Cpp':
          case 'C':
              envData = { OS: 'windows', cmd: 'g++', options: { timeout: 10000 } };
              if (input) {
                  compiler.compileCPPWithInput(envData, code, input, (data) => {
                      if (data.error) {
                          reject({ output: data.error });
                      } else {
                          resolve(data);
                      }
                  });
              } else {
                  compiler.compileCPP(envData, code, (data) => {
                      if (data.error) {
                          reject({ output: data.error });
                      } else {
                          resolve(data);
                      }
                  });
              }
              break;
          case 'Java':
              envData = { OS: 'windows', options: { timeout: 10000 } };
              if (input) {
                  compiler.compileJavaWithInput(envData, code, input, (data) => {
                      if (data.error) {
                          reject({ output: data.error });
                      } else {
                          resolve(data);
                      }
                  });
              } else {
                  compiler.compileJava(envData, code, (data) => {
                      if (data.error) {
                          reject({ output: data.error });
                      } else {
                          resolve(data);
                      }
                  });
              }
              break;
          case 'Python':
              envData = { OS: 'windows', options: { timeout: 10000 } };
              if (input) {
                  compiler.compilePythonWithInput(envData, code, input, (data) => {
                      if (data.error) {
                          reject({ output: data.error });
                      } else {
                          resolve(data);
                      }
                  });
              } else {
                  compiler.compilePython(envData, code, (data) => {
                      if (data.error) {
                          reject({ output: data.error });
                      } else {
                          resolve(data);
                      }
                  });
              }
              break;
          default:
              reject({ output: 'Unsupported language' });
      }
  });
};


module.exports = { compileCode };
