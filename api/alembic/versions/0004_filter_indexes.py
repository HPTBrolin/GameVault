from alembic import op
import sqlalchemy as sa

revision = '0004_filter_indexes'
down_revision = '0003_add_index_added_at'
branch_labels = None
depends_on = None

def upgrade():
    with op.batch_alter_table('game') as b:
        b.create_index('ix_game_platform', ['platform'], unique=False)
        b.create_index('ix_game_status', ['status'], unique=False)
        b.create_index('ix_game_is_board_game', ['is_board_game'], unique=False)
        b.create_index('ix_game_title', ['title'], unique=False)

def downgrade():
    with op.batch_alter_table('game') as b:
        b.drop_index('ix_game_title')
        b.drop_index('ix_game_is_board_game')
        b.drop_index('ix_game_status')
        b.drop_index('ix_game_platform')
