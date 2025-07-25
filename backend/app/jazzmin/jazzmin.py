JAZZMIN_SETTINGS = {
    "site_title": "Bjollys Admin",
    "site_header": "Bjollys",
    "site_brand": "Bjollys",
    "site_logo": "/images/bijolis-logo.png",
    "login_logo": "/images/bijolis-logo.png",
    "login_logo_dark": "/images/bijolis-logo.png",
    "site_logo_classes": "img-circle",
    "site_icon": None,
    "welcome_sign": "Welcome to the bjollys",
    "copyright": "Bjollys Library Ltd",
    "search_model": ["accounts.User", "auth.Group"],  # fixed
    "user_avatar": None,
    "show_sidebar": True,
    "navigation_expanded": True,
    "hide_apps": [],
    "hide_models": [],
    "order_with_respect_to": ["auth", "books", "books.author", "books.book"],
    "custom_links": {
        "books": [{
            "name": "Make Messages", 
            "url": "make_messages", 
            "icon": "fas fa-comments",
            "permissions": ["books.view_book"]
        }]
    },
    "icons": {
        "auth": "fas fa-users-cog",
        "accounts.user": "fas fa-user",       # fixed
        "auth.Group": "fas fa-users",
    },
    "default_icon_parents": "fas fa-chevron-circle-right",
    "default_icon_children": "fas fa-circle",
    "related_modal_active": False,
    "custom_css": "css/custom.css",
    "custom_js": None,
    "use_google_fonts_cdn": True,
    "show_ui_builder": False,
    "changeform_format": "horizontal_tabs",
    "changeform_format_overrides": {
        "accounts.user": "collapsible",       # fixed
        "auth.group": "vertical_tabs"
    },
    "language_chooser": False,
}
