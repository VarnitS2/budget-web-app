import sqlite3
import click
from flask import current_app, g
from flask.cli import with_appcontext
import csv
from datetime import datetime


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
            merchant = d['Category'].capitalize()
            transaction_type = 'expense' if d['Type'] == '-' else 'income'
            amount = d['Amount']
            transaction_date = datetime.strptime(d['Date'], '%m/%d/%y').date()
            
            try:
                db.execute('INSERT INTO transactions (merchant, transaction_type, amount, transaction_date) VALUES (?, ?, ?, ?)', (merchant, transaction_type, amount, transaction_date))
                db.commit()
            except db.Error as e:
                return 'ERROR IMPORTING DATA'

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


def init_app(app):
    app.teardown_appcontext(close_db)
    app.cli.add_command(init_db_command)
    app.cli.add_command(import_data_command)
