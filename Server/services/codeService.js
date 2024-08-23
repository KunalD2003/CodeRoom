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
          compiler.compileCPPWithInput(envData, code, input, resolve);
        } else {
          compiler.compileCPP(envData, code, resolve);
        }
        break;
      case 'Java':
        envData = { OS: 'windows', options: { timeout: 10000 } };
        if (input) {
          compiler.compileJavaWithInput(envData, code, input, resolve);
        } else {
          compiler.compileJava(envData, code, resolve);
        }
        break;
      case 'Python':
        envData = { OS: 'windows', options: { timeout: 10000 } };
        if (input) {
          compiler.compilePythonWithInput(envData, code, input, resolve);
        } else {
          compiler.compilePython(envData, code, resolve);
        }
        break;
      default:
        reject({ output: 'Unsupported language' });
    }
  });
};

module.exports = { compileCode };
