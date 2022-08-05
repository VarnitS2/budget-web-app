import sqlite3
import click
from flask import current_app, g
from flask.cli import with_appcontext
import csv
from datetime import datetime

CATEGORY = 'Category'
TYPE = 'Type'
AMOUNT = 'Amount'
DATE = 'Date'


def get_db():
    if 'db' not in g:
        g.db = sqlite3.connect(
            current_app.config['DATABASE'],
            detect_types=sqlite3.PARSE_DECLTYPES
        )
        g.db.row_factory = sqlite3.Row

    return g.db


def close_db(e=None):
    db = g.pop('db', None)

    if db is not None:
        db.close()


def init_db():
    db = get_db()

    with current_app.open_resource('schema.sql') as f:
        db.executescript(f.read().decode('utf8'))


def import_data():
    db = get_db()

    with current_app.open_resource('data.csv', mode="rt") as f:
        data = csv.DictReader(f)

        for d in data:
            merchant = d[CATEGORY].capitalize()
            transaction_type = 'expense' if d[TYPE] == '-' else 'income'
            amount = d[AMOUNT]
            transaction_date = datetime.strptime(d[DATE], '%m/%d/%y').date()

            try:
                db.execute('INSERT INTO transactions (merchant, transaction_type, amount, transaction_date) VALUES (?, ?, ?, ?;',
                           (merchant, transaction_type, amount, transaction_date))
                db.commit()
            except db.Error as e:
                return 'ERROR IMPORTING DATA'

    return 'SUCCESS'


def dump_data():
    db = get_db()

    with current_app.open_instance_resource('data.csv', mode='w') as f:
        data_headers = [CATEGORY, TYPE, AMOUNT, DATE]
        writer = csv.DictWriter(f, fieldnames=data_headers)

        try:
            data = db.execute('SELECT * FROM transactions;').fetchall()
        except db.Error as e:
            return 'ERROR DUMPING DATA'
        else:
            writer.writeheader()

            for data_point in data:
                writer.writerow({
                    CATEGORY: tuple(data_point)[1],
                    TYPE: tuple(data_point)[2],
                    AMOUNT: tuple(data_point)[3],
                    DATE: tuple(data_point)[4],
                })

    return 'SUCCESS'


@click.command('init-db')
@with_appcontext
def init_db_command():
    """Clear the existing data and create new tables."""
    init_db()
    click.echo('Initialized the database.')


@click.command('import-data')
@with_appcontext
def import_data_command():
    res = import_data()
    click.echo('Response: {}'.format(res))


@click.command('dump-data')
@with_appcontext
def dump_data_command():
    res = dump_data()
    click.echo('Response: {}'.format(res))


def init_app(app):
    app.teardown_appcontext(close_db)
    app.cli.add_command(init_db_command)
    app.cli.add_command(import_data_command)
    app.cli.add_command(dump_data_command)
