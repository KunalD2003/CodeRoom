const codeService = require('../services/codeService');

const compileCode = async (req, res) => {
  const { code, input, lang } = req.body;
  try {
    const result = await codeService.compileCode({ code, input, lang });
    res.send(result);
  } catch (error) {
    console.error('Compilation error:', error);
    res.status(500).send({ output: error.output || 'Internal Server Error' });
  }
};


module.exports = { compileCode };
