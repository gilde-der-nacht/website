"""introduce snapshot uuid

Revision ID: 7432b7c8c510
Revises: 6741ba40c976
Create Date: 2022-04-23 22:20:45.122973

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '7432b7c8c510'
down_revision = '6741ba40c976'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('entries', sa.Column('snapshot_uuid', sa.String(), server_default='00000000-0000-0000-0000-000000000000', nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('entries', 'snapshot_uuid')
    # ### end Alembic commands ###
