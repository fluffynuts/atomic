### Using Atom My Way (tm) for ABX:

1. download the Atom editor. If you can reach it, you can get it (quicker) here:
    [ftp://moo/AtomInstaller.exe](ftp://moo/AtomInstaller.exe)
2. install Atom _(surprise!)_
3. open the Settings tab (``File`` -> ``Settings`` or Ctrl-,)
4. navigate to the ``+Install`` tab and install the following packages:
  - ``atom-save-all``
    - allows you to bind a key to save all files, not just the current one
  - ``atom-typescript``
    - I believe this installs the ``linter`` package too
  - ``custom-title``
    - we'll come back to configuring this; it's optional, but you can get more information in your titlebar with this package
  - ``gulp-control``
    - we'll be able to get gulp running in our IDE. Whee!
    - we will have to hack it a little though, to play nicer with the current gulpfile.js; it's not a mission and I have submitted a pull request to the package owner.
  - ``navigation-history``
    - Atom, by default, doesn't seem to have any baked-in mechanism for winding back out of a 'go-to-references' spiral. This package helps with that.
  - ``vim-mode-plus``
    - only if you're hardcore enough to vim it up
  - ``activate-power-mode``
    - for teh lulz
5. close Atom and copy the provided files to the .atom folder in your profile folder
  - config.cson
  - keymap.cson
  - snippets.cson
6. we need to hack the ``gulp-control`` package a little to optimise output: it doesn't recognise lines which overwrite prior lines. Edit
  - open .atom/packages/gulp-control/lib/gulp-control-view.coffee in _another_ editor
  - find the writeOutput function (line 150 at at time of writing) and modify to look like:
  ```
  writeOutput: (line, klass) ->
    parts = line.split('\r')
    line = parts[parts.length-1]
    if line and line.length
      @outputPane.append "<pre class='#{klass or ''}'>#{line}</pre>"
      @outputPane.scrollToBottom()
    return
  ```
7. restart atom and open your ABX folder. The tree view should be on the right -- if you don't like that, find the tree-view package from the settings pane and change it
8. usage:
  1. open the spec and / or ts you're about to work on
  2. split-right (right-click the tab or editor to get the option)
  3. split-bottom on the right pane
  4. you should now have one of your files open three times -- don't worry yet. Focus the upper one and...
  5. alt-` to opens the fuzzy-finder; type ``gulp``. You should see an item called ``Gulp Control: Toggle``. Press enter. This should open a tab on the right with all the gulp tasks that are known in a selector on the left and output on the right. You can just click a task (eg ``watch``) to run it. You can close the other tab which is alongside your gulp runner. Focus the tab below this and...
  6. ctrl-shift-t opens the fuzzy finder to find a file (like R#'s find file). You can use this to open the relevant .md for the feature you're working on. ctrl-shift-m opens a new tab next to that with the md in a formatted view. Feel free to close the original .md
  7. ctrl-shift-r opens the fuzzy finder to find types (I never really liked R#'s ctrl-t)
  8. ctrl-tab and ctrl-shift-tab may not behave as you expect -- if not, try ctrl-pageup and ctrl-pagedown or go read up about Atom's ctrl-tab behaviour which changed to MRU instead of ordered because allegedly 'there were many requests for it'
  9. From the View menu, you can select ``Toggle Menu Bar`` to have the menu bar hide and only come back when you press ``alt``
  10. ctrl-shift-s should save all open files (as does ctrl-s)
  11. F12 should go to definition and ctrl-- should come back out again
  12. From the View menu, if you're curious about how anything works (the editor or packages), you can select ``Developer`` -> ``Toggle Developer Tools``. This is how I figured out how to get to some of the settings I needed as well as how to hack the gulp-control package to deal with line rewrites
  13. ``activate-power-mode`` is active by default. Whilst its funsies, it may get a bit much -- either uninstall (boo!) or go to the settings for the package (find the package in the settings tab, on the packages sub-tab and click it to get settings) and disable Auto-Toggle. You can still toggle it back on for when you're about to code-rage!
