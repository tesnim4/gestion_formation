export const MENU_ITEMS = [
    {
        to: '/accueil',
        label: 'Tableau de bord',
        icon: '🏠',
        desc: 'Vue d’ensemble de votre espace.',
        roles: [],
        hideOnHome: true,
    },
    {
        to: '/apprenants',
        label: 'Apprenants',
        icon: '🎓',
        desc: 'Consulter et gérer les apprenants.',
        roles: ['ROLE_ADMIN', 'ROLE_FORMATEUR'],
    },
    {
        to: '/themes',
        label: 'Thèmes',
        icon: '📚',
        desc: 'Les thèmes de formation proposés.',
        roles: ['ROLE_ADMIN', 'ROLE_FORMATEUR'],
    },
    {
        to: '/sessions',
        label: 'Sessions',
        icon: '🗓️',
        desc: 'Planifier et suivre les sessions.',
        roles: ['ROLE_ADMIN', 'ROLE_FORMATEUR','ROLE_APPRENANT'],
    },
    {
        to: '/formateurs',
        label: 'Formateurs',
        icon: '👨‍🏫',
        desc: 'Administrer l’équipe de formateurs.',
        roles: ['ROLE_ADMIN'],
    },
    {
        to: '/inscriptions',
        label: 'Inscriptions',
        icon: '📝',
        desc: 'Suivre les inscriptions aux sessions.',
        roles: [],
    },
];

export const ROLE_LABELS = {
    ROLE_ADMIN: 'Administrateur',
    ROLE_FORMATEUR: 'Formateur',
    ROLE_APPRENANT: 'Apprenant',
};

export function canSee(item, user) {
    if (!item.roles.length) return true;
    return item.roles.some(r => user?.roles?.includes(r));
}

export function sidebarTip(user) {
    if (user?.roles?.includes('ROLE_ADMIN'))
        return { title: 'Espace administrateur', text: 'Vous avez un accès complet à la gestion de la plateforme.' };
    if (user?.roles?.includes('ROLE_FORMATEUR'))
        return { title: 'Espace formateur', text: 'Gérez vos sessions, vos thèmes et vos apprenants.' };
    return { title: 'Espace apprenant', text: 'Consultez vos inscriptions aux sessions de formation.' };
}

export function roleClass(role) {
    return (role || '').replace('ROLE_', '').toLowerCase();
}
