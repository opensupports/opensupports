import React from 'react';

import i18n from 'lib-app/i18n';
import ArticlesList from 'app-components/articles-list';
import Header from 'core-components/header';

class DashboardListArticlesPage extends React.Component {

    render() {
        return (
            <div>
                <Header title={i18n('LIST_ARTICLES')} description={i18n('LIST_ARTICLES_DESCRIPTION')}/>
                <ArticlesList editable={false} articlePath="/dashboard/article/"/>
            </div>
        );
    }
}

export default DashboardListArticlesPage;
