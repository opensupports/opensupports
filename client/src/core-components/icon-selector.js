import React from 'react';

import Icon from 'core-components/icon';
import Tooltip from 'core-components/tooltip';

const icons = ['address-card', 'address-card-o', 'adjust', 'american-sign-language-interpreting', 'anchor', 'archive', 'area-chart', 'arrows', 'arrows-h', 'arrows-v', 'asl-interpreting (alias)', 'assistive-listening-systems', 'asterisk', 'audio-description', 'automobile (alias)', 'balance-scale', 'ban', 'bank (alias)', 'bar-chart', 'bar-chart-o (alias)', 'barcode', 'bars', 'bath', 'bathtub (alias)', 'battery (alias)', 'battery-0 (alias)', 'battery-1 (alias)', 'battery-2 (alias)', 'battery-3 (alias)', 'battery-4 (alias)', 'battery-empty', 'battery-full', 'battery-half', 'battery-quarter', 'battery-three-quarters', 'bed', 'beer', 'bell', 'bell-o', 'bell-slash', 'bell-slash-o', 'bicycle', 'binoculars', 'birthday-cake', 'blind', 'bluetooth', 'bluetooth-b', 'bolt', 'bomb', 'book', 'bookmark', 'bookmark-o', 'braille', 'briefcase', 'bug', 'building', 'building-o', 'bullhorn', 'bullseye', 'bus', 'cab (alias)', 'calculator', 'calendar', 'calendar-check-o', 'calendar-minus-o', 'calendar-o', 'calendar-plus-o', 'calendar-times-o', 'camera', 'camera-retro', 'car', 'caret-square-o-down', 'caret-square-o-left', 'caret-square-o-right', 'caret-square-o-up', 'cart-arrow-down', 'cart-plus', 'certificate', 'check', 'check-circle', 'check-circle-o', 'check-square', 'check-square-o', 'child', 'circle', 'circle-o', 'circle-o-notch', 'circle-thin', 'clock-o', 'clone', 'close (alias)', 'cloud', 'cloud-download', 'cloud-upload', 'code', 'code-fork', 'coffee', 'cog', 'cogs', 'comment', 'comment-o', 'commenting', 'commenting-o', 'comments', 'comments-o', 'compass', 'copyright', 'creative-commons', 'credit-card', 'credit-card-alt', 'crop', 'crosshairs', 'cube', 'cubes', 'cutlery', 'dashboard (alias)', 'database', 'deaf', 'deafness (alias)', 'desktop', 'diamond', 'dot-circle-o', 'download', 'drivers-license (alias)', 'drivers-license-o (alias)', 'edit (alias)', 'ellipsis-h', 'ellipsis-v', 'envelope', 'envelope-o', 'envelope-open', 'envelope-open-o', 'envelope-square', 'eraser', 'exchange', 'exclamation', 'exclamation-circle', 'exclamation-triangle', 'external-link', 'external-link-square', 'eye', 'eye-slash', 'eyedropper', 'fax', 'feed (alias)', 'female', 'fighter-jet', 'file-archive-o', 'file-audio-o', 'file-code-o', 'file-excel-o', 'file-image-o', 'file-movie-o (alias)', 'file-pdf-o', 'file-photo-o (alias)', 'file-picture-o (alias)', 'file-powerpoint-o', 'file-sound-o (alias)', 'file-video-o', 'file-word-o', 'file-zip-o (alias)', 'film', 'filter', 'fire', 'fire-extinguisher', 'flag', 'flag-checkered', 'flag-o', 'flash (alias)', 'flask', 'folder', 'folder-o', 'folder-open', 'folder-open-o', 'frown-o', 'futbol-o', 'gamepad', 'gavel', 'gear (alias)', 'gears (alias)', 'gift', 'glass', 'globe', 'graduation-cap', 'group (alias)', 'hand-grab-o (alias)', 'hand-lizard-o', 'hand-paper-o', 'hand-peace-o', 'hand-pointer-o', 'hand-rock-o', 'hand-scissors-o', 'hand-spock-o', 'hand-stop-o (alias)', 'handshake-o', 'hard-of-hearing (alias)', 'hashtag', 'hdd-o', 'headphones', 'heart', 'heart-o', 'heartbeat', 'history', 'home', 'hotel (alias)', 'hourglass', 'hourglass-1 (alias)', 'hourglass-2 (alias)', 'hourglass-3 (alias)', 'hourglass-end', 'hourglass-half', 'hourglass-o', 'hourglass-start', 'i-cursor', 'id-badge', 'id-card', 'id-card-o', 'image (alias)', 'inbox', 'industry', 'info', 'info-circle', 'institution (alias)', 'key', 'keyboard-o', 'language', 'laptop', 'leaf', 'legal (alias)', 'lemon-o', 'level-down', 'level-up', 'life-bouy (alias)', 'life-buoy (alias)', 'life-ring', 'life-saver (alias)', 'lightbulb-o', 'line-chart', 'location-arrow', 'lock', 'low-vision', 'magic', 'magnet', 'mail-forward (alias)', 'mail-reply (alias)', 'mail-reply-all (alias)', 'male', 'map', 'map-marker', 'map-o', 'map-pin', 'map-signs', 'meh-o', 'microchip', 'microphone', 'microphone-slash', 'minus', 'minus-circle', 'minus-square', 'minus-square-o', 'mobile', 'mobile-phone (alias)', 'money', 'moon-o', 'mortar-board (alias)', 'motorcycle', 'mouse-pointer', 'music', 'navicon (alias)', 'newspaper-o', 'object-group', 'object-ungroup', 'paint-brush', 'paper-plane', 'paper-plane-o', 'paw', 'pencil', 'pencil-square', 'pencil-square-o', 'percent', 'phone', 'phone-square', 'photo (alias)', 'picture-o', 'pie-chart', 'plane', 'plug', 'plus', 'plus-circle', 'plus-square', 'plus-square-o', 'podcast', 'power-off', 'print', 'puzzle-piece', 'qrcode', 'question', 'question-circle', 'question-circle-o', 'quote-left', 'quote-right', 'random', 'recycle', 'refresh', 'registered', 'remove (alias)', 'reorder (alias)', 'reply', 'reply-all', 'retweet', 'road', 'rocket', 'rss', 'rss-square', 's15 (alias)', 'search', 'search-minus', 'search-plus', 'send (alias)', 'send-o (alias)', 'server', 'share', 'share-alt', 'share-alt-square', 'share-square', 'share-square-o', 'shield', 'ship', 'shopping-bag', 'shopping-basket', 'shopping-cart', 'shower', 'sign-in', 'sign-language', 'sign-out', 'signal', 'signing (alias)', 'sitemap', 'sliders', 'smile-o', 'snowflake-o', 'soccer-ball-o (alias)', 'sort', 'sort-alpha-asc', 'sort-alpha-desc', 'sort-amount-asc', 'sort-amount-desc', 'sort-asc', 'sort-desc', 'sort-down (alias)', 'sort-numeric-asc', 'sort-numeric-desc', 'sort-up (alias)', 'space-shuttle', 'spinner', 'spoon', 'square', 'square-o', 'star', 'star-half', 'star-half-empty (alias)', 'star-half-full (alias)', 'star-half-o', 'star-o', 'sticky-note', 'sticky-note-o', 'street-view', 'suitcase', 'sun-o', 'support (alias)', 'tablet', 'tachometer', 'tag', 'tags', 'tasks', 'taxi', 'television', 'terminal', 'thermometer (alias)', 'thermometer-0 (alias)', 'thermometer-1 (alias)', 'thermometer-2 (alias)', 'thermometer-3 (alias)', 'thermometer-4 (alias)', 'thermometer-empty', 'thermometer-full', 'thermometer-half', 'thermometer-quarter', 'thermometer-three-quarters', 'thumb-tack', 'thumbs-down', 'thumbs-o-down', 'thumbs-o-up', 'thumbs-up', 'ticket', 'times', 'times-circle', 'times-circle-o', 'times-rectangle (alias)', 'times-rectangle-o (alias)', 'tint', 'toggle-down (alias)', 'toggle-left (alias)', 'toggle-off', 'toggle-on', 'toggle-right (alias)', 'toggle-up (alias)', 'trademark', 'trash', 'trash-o', 'tree', 'trophy', 'truck', 'tty', 'tv (alias)', 'umbrella', 'universal-access', 'university', 'unlock', 'unlock-alt', 'unsorted (alias)', 'upload', 'user', 'user-circle', 'user-circle-o', 'user-o', 'user-plus', 'user-secret', 'user-times', 'users', 'vcard (alias)', 'vcard-o (alias)', 'video-camera', 'volume-control-phone', 'volume-down', 'volume-off', 'volume-up', 'warning (alias)', 'wheelchair', 'wheelchair-alt', 'wifi', 'window-close', 'window-close-o', 'window-maximize', 'window-minimize', 'window-restore', 'wrench'];

class IconSelector extends React.Component {
    static propTypes = {
        value: React.PropTypes.string,
        onChange: React.PropTypes.func
    };

    static defaultProps = {
        value: 'adjust'
    };
    
    state = {
        show: false
    };

    render() {
        return (
            <div className="icon-selector">
                <Tooltip content={this.renderTooltipContent()} show={this.state.show} onToggle={(show) => this.setState({show})}>
                    <span className="icon-selector__current-icon">
                        <Icon name={this.props.value} />
                    </span>
                </Tooltip>
            </div>
        );
    }

    renderTooltipContent() {
        return (
            <div className="icon-selector__tooltip">
                {icons.map(this.renderTooltipIcon.bind(this))}
            </div>
        );
    }

    renderTooltipIcon(name, index) {
        return (
            <div className="icon-selector__tooltip-icon" onClick={this.onIconClick.bind(this, name)} key={index}>
                <Icon name={name} />
            </div>
        );
    }

    onIconClick(name) {
        this.setState({
            show: false
        });
        
        if(this.props.onChange) {
            this.props.onChange({target: {value: name}});
        }
    }
}

export default IconSelector;