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
        start_date = request.get_json()['start_date']
        end_date = request.get_json()['end_date']

        try:
            if start_date == "":
                start_date = datetime.date.fromisoformat(tuple(db.execute(
                    'SELECT MIN(transaction_date) FROM transactions;').fetchone())[0])
            else:
                start_date = datetime.date.fromisoformat(
                    start_date.split('T')[0])

            if end_date == "":
                end_date = datetime.date.fromisoformat(tuple(db.execute(
                    'SELECT MAX(transaction_date) FROM transactions;').fetchone())[0])
            else:
                end_date = datetime.date.fromisoformat(end_date.split('T')[0])

            transactions = db.execute(
                'SELECT * FROM transactions WHERE transaction_date BETWEEN ? AND ?;', (start_date, end_date)).fetchall()
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
def get_sidebar():
    if request.method == 'POST':
        db = get_db()
        start_date = request.get_json()['start_date']
        end_date = request.get_json()['end_date']

        previous_start_empty_flag = False
        previous_end_empty_flag = False

        try:
            if start_date == "":
                start_date = datetime.date.fromisoformat(tuple(db.execute(
                    'SELECT MIN(transaction_date) FROM transactions;').fetchone())[0])
                previous_start_empty_flag = True
            else:
                start_date = datetime.date.fromisoformat(
                    start_date.split('T')[0])

            if end_date == "":
                end_date = datetime.date.fromisoformat(tuple(db.execute(
                    'SELECT MAX(transaction_date) FROM transactions;').fetchone())[0])
                previous_end_empty_flag = True
            else:
                end_date = datetime.date.fromisoformat(end_date.split('T')[0])

            transactions = db.execute(
                'SELECT * FROM transactions WHERE transaction_date BETWEEN ? AND ?;', (start_date, end_date)).fetchall()
            balance = 0.0
            income = 0.0
            expense = 0.0
            category_amounts = dict()
            for transaction in transactions:
                transaction = tuple(transaction)

                if transaction[TRANSACTION_TYPE] == 'income':
                    balance += transaction[TRANSACTION_AMOUNT]
                    income += transaction[TRANSACTION_AMOUNT]
                elif transaction[TRANSACTION_TYPE] == 'expense':
                    balance -= transaction[TRANSACTION_AMOUNT]
                    expense += transaction[TRANSACTION_AMOUNT]
                    category_amounts[transaction[TRANSACTION_MERCHANT]] = round(category_amounts.get(
                        transaction[TRANSACTION_MERCHANT], 0) + transaction[TRANSACTION_AMOUNT], 2)

            avg_per_day = expense / ((end_date - start_date).days + 1)
            max_per_day = income / ((end_date - start_date).days + 1)
            saved = (1 - (expense / income)) * 100 if income != 0 else 0

            top_categories = [x for _, x in sorted(zip(
                category_amounts.values(), category_amounts.keys()), key=lambda pair: -pair[0])]
            top_category_amounts = sorted(
                category_amounts.values(), reverse=True)

            previous_stats = []
            loop_start = 1
            previous_first_expense = 0.0

            if previous_start_empty_flag and previous_end_empty_flag:
                start_date = datetime.date.today().replace(day=1)   # MUTATING PROVIDED START DATE
                end_date = datetime.date.today()                    # MUTATING PROVIDED END DATE
                loop_start = 0

            for i in range(loop_start, 7):
                previous_start_date = start_date.replace(
                    month=start_date.month-i) if start_date.month > i else start_date.replace(month=12-(i - start_date.month), year=start_date.year-1)

                try:
                    previous_end_date = end_date.replace(
                        month=end_date.month-i) if end_date.month > i else end_date.replace(month=12-(i - end_date.month), year=end_date.year-1)
                except ValueError:
                    try:
                        previous_end_date = end_date.replace(day=30, month=end_date.month-i) if end_date.month > i else end_date.replace(
                            day=30, month=12-(i - end_date.month), year=end_date.year-1)
                    except ValueError:
                        previous_end_date = end_date.replace(day=28, month=end_date.month-i) if end_date.month > i else end_date.replace(
                            day=28, month=12-(i - end_date.month), year=end_date.year-1)

                previous_transactions = db.execute(
                    'SELECT * FROM transactions WHERE transaction_date BETWEEN ? AND ?;', (previous_start_date, previous_end_date)).fetchall()

                previous_expense = 0.0

                for previous_transaction in previous_transactions:
                    previous_transaction = tuple(previous_transaction)

                    if previous_transaction[TRANSACTION_TYPE] == 'expense':
                        previous_expense += previous_transaction[TRANSACTION_AMOUNT]

                if i == 0:
                    previous_first_expense = previous_expense

                previous_stats.append({
                    'start_date': previous_start_date,
                    'end_date': previous_end_date.isoformat(),
                    'expense': round(previous_expense, 2),
                    'diff': round((1 - (expense / previous_expense)) * 100, 2) if loop_start == 1 else round((1 - (previous_first_expense / previous_expense)) * 100, 2)
                })

        except db.Error as e:
            return jsonify(status=500, message='Error: ' + e)
        else:
            return jsonify(status=200, message={
                'balance': round(balance, 2),
                'income': round(income, 2),
                'expense': round(expense, 2),
                'avg_per_day': round(avg_per_day, 2),
                'max_per_day': round(max_per_day, 2),
                'saved': round(saved, 2),
                'top_expenses': [{
                    'category': top_categories[idx],
                    'amount': top_category_amounts[idx]
                } if idx < len(top_categories) else {} for idx in range(3)],
                'previous_stats': previous_stats
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
