import React from 'react';

import i18n from 'lib-app/i18n';
import ArticlesList from 'app-components/articles-list';
import Header from 'core-components/header';

class AdminPanelListArticles extends React.Component {

    render() {
        return (
            <div className="admin-panel-list-articles">
                <Header title={i18n('LIST_ARTICLES')} description={i18n('LIST_ARTICLES_DESCRIPTION')}/>
                <div className="admin-panel-list-articles__list">
                    <ArticlesList editable/>
                </div>
            </div>
        );
    }
}

export default AdminPanelListArticles;
