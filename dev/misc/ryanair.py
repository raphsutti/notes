#!/usr/bin/env python3

import iterm2
import time


async def main(connection):
    app = await iterm2.async_get_app(connection)
    window = app.current_terminal_window
    timeout = 3
    if window is not None:
        # Run ryanair service
        await window.async_create_tab()
        session = app.current_terminal_window.current_tab.current_session
        await session.async_send_text('cd ~/code/indie-ryanair-service\nys\n')
        time.sleep(timeout)
        change = iterm2.LocalWriteOnlyProfile()
        color = iterm2.Color(204, 0, 126)
        change.set_tab_color(color)
        change.set_use_tab_color(True)
        await session.async_set_profile_properties(change)
        await session.async_set_name("ryanair serv")

        # Run ryanair frontend
        await window.async_create_tab()
        session = app.current_terminal_window.current_tab.current_session
        await session.async_send_text('cd ~/code/indie-ryanair-frontend\nys\n')
        time.sleep(timeout)
        change = iterm2.LocalWriteOnlyProfile()
        color = iterm2.Color(0, 140, 240)
        change.set_tab_color(color)
        change.set_use_tab_color(True)
        await session.async_set_profile_properties(change)
        await session.async_set_name("ryanair front")

    else:
        # You can view this message in the script console.
        print("No current window")

iterm2.run_until_complete(main)
