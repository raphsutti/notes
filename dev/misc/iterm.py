#!/usr/bin/env python3

import iterm2
import time


async def main(connection):
    app = await iterm2.async_get_app(connection)
    window = app.current_terminal_window
    timeout = 3
    if window is not None:
        # Run Ariana
        await window.async_create_tab()
        session = app.current_terminal_window.current_tab.current_session

        await session.async_send_text('cd ~/code/indie-ariana-service\nys\n')
        time.sleep(timeout)
        change = iterm2.LocalWriteOnlyProfile()
        color = iterm2.Color(255, 128, 128)
        change.set_tab_color(color)
        change.set_use_tab_color(True)
        await session.async_set_profile_properties(change)
        await session.async_set_name("ariana")

        # Run Rita-Ora
        await window.async_create_tab()
        session = app.current_terminal_window.current_tab.current_session
        await session.async_send_text('cd ~/code/indie-rita-ora\nys\n')
        time.sleep(timeout)
        change = iterm2.LocalWriteOnlyProfile()
        color = iterm2.Color(245, 193, 7)
        change.set_tab_color(color)
        change.set_use_tab_color(True)
        await session.async_set_profile_properties(change)
        await session.async_set_name("rita")

        # Run Billie-Eilish
        await window.async_create_tab()
        session = app.current_terminal_window.current_tab.current_session
        await session.async_send_text('cd ~/code/indie-billie-eilish\nys\n')
        time.sleep(timeout)
        change = iterm2.LocalWriteOnlyProfile()
        color = iterm2.Color(0, 204, 143)
        change.set_tab_color(color)
        change.set_use_tab_color(True)
        await session.async_set_profile_properties(change)
        await session.async_set_name("billie")

        # Run Fka-twigs
        await window.async_create_tab()
        session = app.current_terminal_window.current_tab.current_session
        await session.async_send_text('cd ~/code/indie-fka-twigs\nys\n')
        time.sleep(timeout)
        change = iterm2.LocalWriteOnlyProfile()
        color = iterm2.Color(105, 0, 204)
        change.set_tab_color(color)
        change.set_use_tab_color(True)
        await session.async_set_profile_properties(change)
        await session.async_set_name("fka")

        # Run Shakira
        await window.async_create_tab()
        session = app.current_terminal_window.current_tab.current_session
        await session.async_send_text('cd ~/code/indie-shakira\nys\n')
        time.sleep(timeout)
        change = iterm2.LocalWriteOnlyProfile()
        color = iterm2.Color(252, 252, 28)
        change.set_tab_color(color)
        change.set_use_tab_color(True)
        await session.async_set_profile_properties(change)
        await session.async_set_name("shakira")

        # Run Back Office graph
        await window.async_create_tab()
        session = app.current_terminal_window.current_tab.current_session
        await session.async_send_text('cd ~/code/backoffice-graphql-server\nys\n')
        time.sleep(timeout)
        change = iterm2.LocalWriteOnlyProfile()
        color = iterm2.Color(204, 0, 126)
        change.set_tab_color(color)
        change.set_use_tab_color(True)
        await session.async_set_profile_properties(change)
        await session.async_set_name("bo graph")

        # Run Back Office frontend
        await window.async_create_tab()
        session = app.current_terminal_window.current_tab.current_session
        await session.async_send_text('cd ~/code/backoffice-frontend\nys\n')
        time.sleep(timeout)
        change = iterm2.LocalWriteOnlyProfile()
        color = iterm2.Color(0, 140, 240)
        change.set_tab_color(color)
        change.set_use_tab_color(True)
        await session.async_set_profile_properties(change)
        await session.async_set_name("bo front")

    else:
        # You can view this message in the script console.
        print("No current window")

iterm2.run_until_complete(main)
