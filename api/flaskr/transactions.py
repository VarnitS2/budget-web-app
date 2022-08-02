from flask import (
    Blueprint, g, request
)
from flask.json import jsonify

from flaskr.db import get_db
import datetime

bp = Blueprint('transactions', __name__, url_prefix='/transactions')


@bp.route('/getall', methods=['POST'])
def get_all():
    if request.method == 'POST':
        db = get_db()
        is_reverse = request.get_json()['reverse']

        try:
            transactions = db.execute('SELECT * FROM transactions;').fetchall()
        except db.Error as e:
            return jsonify(status=500, message='Error: ' + e)
        else:
            return_data = [{
                'id': tuple(transaction)[0],
                'merchant': tuple(transaction)[1],
                'transaction_type': tuple(transaction)[2],
                'amount': tuple(transaction)[3],
                'transaction_date': tuple(transaction)[4].isoformat(),
            } for transaction in transactions]

            return_data = sorted(
                return_data, key=lambda d: d['transaction_date'], reverse=is_reverse)

            for idx, data in enumerate(return_data):
                data['idx'] = idx + 1

            return jsonify(status=200, message=return_data)

    else:
        return jsonify(status=405, message='Method not allowed.')


@bp.route('/getallmerchants', methods=['GET'])
def get_all_merchants():
    db = get_db()

    try:
        merchants = db.execute(
            'SELECT DISTINCT merchant FROM transactions;').fetchall()
    except db.Error as e:
        return jsonify(status=500, message='Error: ' + e)
    else:
        return jsonify(status=200, message=[{
            'merchant': tuple(merchant)[0],
        } for merchant in merchants])


@bp.route('/add', methods=['POST'])
def add():
    if request.method == 'POST':
        db = get_db()
        merchant = request.get_json()['merchant']
        transaction_type = request.get_json()['transaction_type']
        amount = request.get_json()['amount']
        transaction_date = datetime.date.fromisoformat(
            request.get_json()['transaction_date'].split('T')[0])

        try:
            db.execute(
                "INSERT INTO transactions (merchant, transaction_type, amount, transaction_date) VALUES (?, ?, ?, ?)",
                (merchant, transaction_type, amount, transaction_date),
            )
            db.commit()
        except db.Error as e:
            return jsonify(status=500, message='Error: ' + e)
        else:
            return jsonify(status=200, message='Transaction added successfully.')

    else:
        return jsonify(status=405, message='Method not allowed.')


@bp.route('/delete', methods=['POST'])
def delete():
    if request.method == 'POST':
        db = get_db()
        id = request.get_json()['id']

        try:
            db.execute(
                "DELETE FROM transactions WHERE id = ?",
                (id,),
            )
            db.commit()
        except db.Error as e:
            return jsonify(status=500, message='Error: ' + e)
        else:
            return jsonify(status=200, message='Transaction deleted successfully.')

    else:
        return jsonify(status=405, message='Method not allowed.')
