from flask import (
    Blueprint, g, request
)
from flask.json import jsonify

from flaskr.db import get_db
import datetime

bp = Blueprint('transactions', __name__, url_prefix='/transactions')

TRANSACTION_ID = 0
TRANSACTION_MERCHANT = 1
TRANSACTION_TYPE = 2
TRANSACTION_AMOUNT = 3
TRANSACTION_DATE = 4


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
                'id': tuple(transaction)[TRANSACTION_ID],
                'merchant': tuple(transaction)[TRANSACTION_MERCHANT],
                'transaction_type': tuple(transaction)[TRANSACTION_TYPE],
                'amount': tuple(transaction)[TRANSACTION_AMOUNT],
                'transaction_date': (tuple(transaction)[TRANSACTION_DATE] + datetime.timedelta(days=1)).isoformat(),
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


@bp.route('/getsidebar', methods=['POST'])
def get_balance():
    if request.method == 'POST':
        db = get_db()
        start_date = request.get_json()['start_date']
        end_date = request.get_json()['end_date']

        try:
            if start_date == "":
                start_date = tuple(db.execute(
                    'SELECT MIN(transaction_date) FROM transactions;').fetchone())[0]
            else:
                start_date = datetime.date.fromisoformat(start_date)

            if end_date == "":
                end_date = tuple(db.execute(
                    'SELECT MAX(transaction_date) FROM transactions;').fetchone())[0]
            else:
                end_date = datetime.date.fromisoformat(end_date)

            transactions = db.execute(
                'SELECT * FROM transactions WHERE transaction_date BETWEEN ? AND ?;', (start_date, end_date)).fetchall()
            balance = 0.0
            income = 0.0
            expense = 0.0
            for transaction in transactions:
                transaction = tuple(transaction)

                if transaction[TRANSACTION_TYPE] == 'income':
                    balance += transaction[TRANSACTION_AMOUNT]
                    income += transaction[TRANSACTION_AMOUNT]
                elif transaction[TRANSACTION_TYPE] == 'expense':
                    balance -= transaction[TRANSACTION_AMOUNT]
                    expense += transaction[TRANSACTION_AMOUNT]

        except db.Error as e:
            return jsonify(status=500, message='Error: ' + e)
        else:
            return jsonify(status=200, message={
                'balance': round(balance, 2),
                'income': round(income, 2),
                'expense': round(expense, 2)
            })

    else:
        return jsonify(status=405, message='Method not allowed.')


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
