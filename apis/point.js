module.exports.getAPI = async function(req, res) {
    var data = await _point._getAll();
    res.send(_output(data ? 200 : 500, null, data));
}