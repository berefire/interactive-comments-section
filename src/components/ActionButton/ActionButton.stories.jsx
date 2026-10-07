import { expect, fn } from 'storybook/test';
import ActionButton from './ActionButton';

export default {
    title: 'Components/ActionButton',
    component: ActionButton,
    args: {
        onClick: fn(),
    },
};

export const Reply = {
    args: {
        children: 'Reply',
        icon: '/assets/images/icons/icon-reply.svg'
    },
    play: async ({ args, canvas, userEvent }) => {
    const button = canvas.getByRole('button', { name: /reply/i });
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

export const Edit = {
    args: {
        children: 'Edit',
        icon: '/assets/images/icons/icon-edit.svg'
    },
    play: async ({ args, canvas, userEvent }) => {
    const button = canvas.getByRole('button', { name: /edit/i });
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

export const Delete = {
    args: {
        variant: 'danger',
        children: 'Delete',
        icon: '/assets/images/icons/icon-delete.svg'
    },
    play: async ({ args, canvas, userEvent }) => {
    const button = canvas.getByRole('button', { name: /delete/i });
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};